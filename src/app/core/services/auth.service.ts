import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface UserProfilePayload {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/users`;
  private readonly userStateSubject = new BehaviorSubject(false);
  readonly userState$ = this.userStateSubject.asObservable();

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    onAuthStateChanged(auth, async (firebaseUser) => {
      this.userStateSubject.next(!!firebaseUser);

      if (!firebaseUser) {
        this.currentUserSubject.next(null);
        return;
      }

      const user = await this.loadUser(firebaseUser);
      this.currentUserSubject.next(user);
    });
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await this.syncCurrentUserProfile();
      await this.refreshCurrentUserProfile();
      return userCredential;
    } catch (error) {
      throw new Error(this.getFirebaseMessage(error, 'login'));
    }
  }

  async logout() {
    await signOut(auth);
  }

  async register(userData: UserProfilePayload, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email ?? '', password);

      if (userData.fullName) {
        await updateProfile(userCredential.user, { displayName: userData.fullName });
      }

      await this.syncCurrentUserProfile(userData);
      await this.refreshCurrentUserProfile();
      return userCredential;
    } catch (error) {
      throw new Error(this.getFirebaseMessage(error, 'register'));
    }
  }

  async getUser(uid: string): Promise<User | null> {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser || firebaseUser.uid !== uid) {
      return null;
    }

    return this.requestCurrentUser(firebaseUser);
  }

  async getAllUsers() {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      throw new Error('Please login first.');
    }

    return firstValueFrom(
      this.http.get<User[]>(this.apiUrl, {
        headers: await this.createAuthHeaders(firebaseUser)
      })
    );
  }

  async syncCurrentUserProfile(userData: UserProfilePayload = {}) {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    try {
      const payload: UserProfilePayload = {
        fullName: userData.fullName ?? firebaseUser.displayName ?? '',
        email: userData.email ?? firebaseUser.email ?? ''
      };

      if (typeof userData.phone === 'string' && userData.phone.trim()) {
        payload.phone = userData.phone.trim();
      }

      if (userData.role) {
        payload.role = userData.role;
      }

      const profile = await firstValueFrom(
        this.http.post<User>(
          `${this.apiUrl}/sync`,
          payload,
          {
            headers: await this.createAuthHeaders(firebaseUser)
          }
        )
      );

      const user = this.formatUser(profile, firebaseUser);
      this.currentUserSubject.next(user);
      return user;
    } catch (error) {
      console.warn('Unable to sync the user profile with the backend.', error);
      return null;
    }
  }

  async ensureCurrentUserProfile(forceRefresh = false) {
    const currentUser = this.currentUserSubject.value;

    if (currentUser && !forceRefresh) {
      return currentUser;
    }

    return this.refreshCurrentUserProfile();
  }

  async getAuthHeaders() {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      throw new Error('Please login first.');
    }

    return this.createAuthHeaders(firebaseUser);
  }

  async refreshCurrentUserProfile() {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      this.currentUserSubject.next(null);
      return null;
    }

    const user = await this.loadUser(firebaseUser);
    this.currentUserSubject.next(user);
    return user;
  }

  private async loadUser(firebaseUser: FirebaseUser) {
    const profile = await this.requestCurrentUser(firebaseUser);
    return profile ?? this.fallbackUser(firebaseUser);
  }

  private async requestCurrentUser(firebaseUser: FirebaseUser): Promise<User | null> {
    try {
      const profile = await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/me`, {
          headers: await this.createAuthHeaders(firebaseUser)
        })
      );

      return this.formatUser(profile, firebaseUser);
    } catch (error) {
      console.warn('Falling back to Firebase auth profile because backend user lookup failed.', error);
      return null;
    }
  }

  private fallbackUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      firebaseUid: firebaseUser.uid,
      fullName: this.getDisplayName(firebaseUser.displayName, firebaseUser.email),
      email: firebaseUser.email || '',
      phone: '',
      role: 'user'
    };
  }

  private formatUser(profile: User, firebaseUser: FirebaseUser): User {
    return {
      ...profile,
      uid: profile.uid || profile.firebaseUid || firebaseUser.uid,
      firebaseUid: profile.firebaseUid || profile.uid || firebaseUser.uid,
      fullName: this.getDisplayName(profile.fullName, profile.email || firebaseUser.email)
    };
  }

  private getDisplayName(fullName?: string | null, email?: string | null) {
    const name = fullName?.trim();

    if (name) {
      return name.includes('@') ? name.split('@')[0] : name;
    }

    if (email) {
      return email.split('@')[0];
    }

    return 'User';
  }

  private getFirebaseMessage(error: any, mode: 'login' | 'register') {
    const code = error?.code || '';

    if (mode === 'login') {
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        return 'Invalid email or password.';
      }

      if (code === 'auth/invalid-email') {
        return 'Please enter a valid email address.';
      }

      if (code === 'auth/too-many-requests') {
        return 'Too many failed attempts. Please try again later.';
      }
    }

    if (mode === 'register') {
      if (code === 'auth/email-already-in-use') {
        return 'This email is already registered. Please login instead.';
      }

      if (code === 'auth/invalid-email') {
        return 'Please enter a valid email address.';
      }

      if (code === 'auth/weak-password') {
        return 'Password should be at least 6 characters.';
      }
    }

    return error?.message || 'Authentication failed. Please try again.';
  }

  private async createAuthHeaders(firebaseUser: FirebaseUser) {
    const token = await firebaseUser.getIdToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}

