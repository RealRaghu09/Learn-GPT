import { API_ENDPOINTS } from '../config/api';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function sendChatMessage({ question, context }) {
  const res = await fetch(API_ENDPOINTS.CHAT, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ question, context }),
  });
  return res.json();
}

export async function summarizeContent({ content, size }) {
  const res = await fetch(API_ENDPOINTS.SUMMARIZE, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ content, size }),
  });
  return res.json();
}

export async function loadPdfContent({ content, type }) {
  const res = await fetch(API_ENDPOINTS.LOAD_PDF, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ content, type }),
  });
  return res.json();
}

export async function postRootContent({ content, type }) {
  const res = await fetch(API_ENDPOINTS.ROOT, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ content, type }),
  });
  return res.json();
}

export async function uploadPdf(formData) {
  const res = await fetch(API_ENDPOINTS.UPLOAD, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function generateQuiz({ content, level }) {
  const res = await fetch(API_ENDPOINTS.QUIZ, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ content, level }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return data;
}
