"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getFirebaseClientConfig, isFirebaseClientConfigured } from "@/lib/firebase/config";

export function getFirebaseClientApp() {
  if (!isFirebaseClientConfigured()) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(getFirebaseClientConfig());
}

export function getFirebaseClientServices() {
  const app = getFirebaseClientApp();
  if (!app) {
    return null;
  }

  return {
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
}
