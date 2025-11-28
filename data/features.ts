import { Feature } from '../types';

export const featuresData: Feature[] = [
  {
    id: 'user-auth',
    name: "User Authentication",
    version: "1.0.0",
    enabled: true,
    description: "Email/password and Google OAuth authentication",
    backend: {
      routes: [
        { method: 'POST', path: '/api/auth/register', handler: 'auth/register.js' },
        { method: 'POST', path: '/api/auth/login', handler: 'auth/login.js' },
        { method: 'POST', path: '/api/auth/logout', handler: 'auth/logout.js' },
        { method: 'GET', path: '/api/auth/me', handler: 'auth/me.js' },
        { method: 'POST', path: '/api/auth/google', handler: 'auth/google.js' },
        { method: 'POST', path: '/api/auth/refresh', handler: 'auth/refresh.js' },
      ]
    },
    config: {
      JWT_SECRET: '${env.JWT_SECRET}',
      JWT_EXPIRY: "7d",
      BCRYPT_ROUNDS: 10,
      GOOGLE_CLIENT_ID: '${env.GOOGLE_CLIENT_ID}',
      GOOGLE_CLIENT_SECRET: '${env.GOOGLE_CLIENT_SECRET}',
    },
    security: {
      rateLimit: {
        register: "3/hour/ip",
        login: "5/15min/ip"
      }
    },
    health: {
      endpoint: '/api/health/auth',
      timeout: 3000,
      autoDisable: 3,
      circuitBreaker: {
        enabled: true,
        failureThreshold: 5,
        timeout: "30s"
      }
    },
    dependencies: { requires: [] },
    monitoring: {
      metrics: ['auth_requests_total', 'auth_failures_total']
    }
  },
  {
    id: 'video-upload',
    name: "Video Upload",
    version: "1.0.0",
    enabled: true,
    description: "File upload and cloud storage",
    backend: {
      routes: [
        { method: 'POST', path: '/api/upload/video', handler: 'upload/video.js' },
        { method: 'POST', path: '/api/upload/thumbnail', handler: 'upload/thumbnail.js' },
        { method: 'GET', path: '/api/upload/signed-url', handler: 'upload/signed-url.js' },
      ]
    },
    config: {
      MAX_FILE_SIZE: "500MB",
      ALLOWED_TYPES: "video/mp4,video/quicktime,video/x-msvideo",
      GCS_BUCKET: '${env.GCS_BUCKET}',
    },
    health: {
      endpoint: '/api/health/upload',
      autoDisable: 3
    },
    dependencies: { requires: ['user-auth'] }
  },
  {
    id: 'video-management',
    name: "Video Management",
    version: "1.0.0",
    enabled: true,
    description: "CRUD operations for videos",
    backend: {
      routes: [
        { method: 'GET', path: '/api/videos', handler: 'video/list.js' },
        { method: 'GET', path: '/api/videos/:id', handler: 'video/get.js' },
        { method: 'PUT', path: '/api/videos/:id', handler: 'video/update.js' },
        { method: 'DELETE', path: '/api/videos/:id', handler: 'video/delete.js' },
      ]
    },
    config: {},
    health: { endpoint: '/api/health/videos' },
    dependencies: { requires: ['user-auth', 'video-upload'] }
  },
  {
    id: 'ai-generation',
    name: "AI Video Generation",
    version: "1.0.0",
    enabled: true,
    description: "Google Cloud AI video generation",
    fallback: "ai-generation-sora",
    backend: {
      routes: [
        { method: 'POST', path: '/api/ai/generate', handler: 'ai/generate.js' },
        { method: 'GET', path: '/api/ai/status/:jobId', handler: 'ai/status.js' },
        { method: 'POST', path: '/api/ai/jobs', handler: 'ai/create-job.js' },
      ]
    },
    config: {
      AI_MODEL: '${env.AI_MODEL}',
      AI_PROJECT_ID: '${env.GCP_PROJECT_ID}',
      MAX_CONCURRENT_JOBS: 5
    },
    health: {
      endpoint: '/api/health/ai',
      autoDisable: 5,
      circuitBreaker: {
        enabled: true,
        failureThreshold: 3
      }
    },
    dependencies: { requires: ['user-auth'] }
  },
  {
    id: 'ai-generation-sora',
    name: "Sora Video Generation (Fallback)",
    version: "1.0.0",
    enabled: true,
    description: "Secondary video generation using Sora as a fallback.",
    fallback: null,
    backend: {
      routes: [
        { method: 'POST', path: '/api/ai/sora/generate', handler: 'ai/sora-generate.js' },
      ]
    },
    config: {
      SORA_API_KEY: '${env.SORA_API_KEY}',
    },
    health: {
      endpoint: '/api/health/sora',
    },
    dependencies: { requires: ['user-auth'] }
  },
  {
    id: 'prompt-optimizer',
    name: "Prompt Optimizer",
    version: "1.0.0",
    enabled: true,
    description: "Refines user prompts into more descriptive options for better results.",
    backend: {
      routes: [
        { method: 'POST', path: '/api/ai/optimize-prompt', handler: 'ai/optimize-prompt.js' },
      ]
    },
    config: {
        OPTIMIZER_MODEL: 'gemini-pro',
    },
    health: {
      endpoint: '/api/health/prompt-optimizer',
    },
    dependencies: { requires: ['ai-generation'] },
    fallback: null,
  },
  {
    id: 'social-publishing',
    name: "Social Media Publishing",
    version: "1.0.0",
    enabled: true,
    description: "Multi-platform content publishing",
    backend: {
      routes: [
        { method: 'POST', path: '/api/social/publish', handler: 'social/publish.js' },
        { method: 'GET', path: '/api/social/platforms', handler: 'social/platforms.js' },
        { method: 'POST', path: '/api/social/youtube', handler: 'social/youtube.js' },
        { method: 'POST', path: '/api/social/instagram', handler: 'social/instagram.js' },
        { method: 'POST', path: '/api/social/tiktok', handler: 'social/tiktok.js' },
        { method: 'GET', path: '/api/social/oauth/:platform', handler: 'social/oauth.js' },
      ]
    },
    config: {
      YOUTUBE_CLIENT_ID: '${env.YOUTUBE_CLIENT_ID}',
      YOUTUBE_CLIENT_SECRET: '${env.YOUTUBE_CLIENT_SECRET}',
      INSTAGRAM_CLIENT_ID: '${env.INSTAGRAM_CLIENT_ID}',
      TIKTOK_CLIENT_KEY: '${env.TIKTOK_CLIENT_KEY}',
    },
    health: { endpoint: '/api/health/social', autoDisable: 3 },
    dependencies: { requires: ['user-auth', 'video-management'] }
  },
  {
    id: 'content-scheduling',
    name: "Content Scheduling",
    version: "1.0.0",
    enabled: true,
    description: "Job scheduling with Bull queues",
    backend: {
      routes: [
        { method: 'POST', path: '/api/schedule', handler: 'schedule/create.js' },
        { method: 'GET', path: '/api/schedule', handler: 'schedule/list.js' },
        { method: 'DELETE', path: '/api/schedule/:id', handler: 'schedule/cancel.js' },
        { method: 'PUT', path: '/api/schedule/:id', handler: 'schedule/update.js' },
      ]
    },
    config: {
      REDIS_URL: '${env.REDIS_URL}',
      MAX_RETRIES: 3
    },
    health: { endpoint: '/api/health/schedule' },
    dependencies: { requires: ['user-auth', 'social-publishing'] }
  },
  {
    id: 'analytics-dashboard',
    name: "Analytics Dashboard",
    version: "1.0.0",
    enabled: true,
    description: "Performance metrics and reporting",
    backend: {
      routes: [
        { method: 'GET', path: '/api/analytics/overview', handler: 'analytics/overview.js' },
        { method: 'GET', path: '/api/analytics/videos/:id', handler: 'analytics/video.js' },
        { method: 'GET', path: '/api/analytics/platforms', handler: 'analytics/platforms.js' },
      ]
    },
    config: {},
    health: { endpoint: '/api/health/analytics' },
    dependencies: { requires: ['user-auth', 'video-management'] }
  },
  {
    id: 'email-notifications',
    name: "Email Notifications",
    version: "1.0.0",
    enabled: false,
    description: "Nodemailer email service",
    fallback: "email-notifications-basic",
    backend: {
      routes: [
        { method: 'POST', path: '/api/email/send', handler: 'email/send.js' },
        { method: 'POST', path: '/api/email/welcome', handler: 'email/welcome.js' },
        { method: 'POST', path: '/api/email/reset-password', handler: 'email/reset.js' },
      ]
    },
    config: {
      SMTP_HOST: '${env.SMTP_HOST}',
      SMTP_PORT: '${env.SMTP_PORT}',
      SMTP_USER: '${env.SMTP_USER}',
      SMTP_PASS: '${env.SMTP_PASS}',
    },
    health: { endpoint: '/api/health/email', autoDisable: 5 },
    dependencies: { requires: [] }
  },
  {
    id: 'thumbnail-generation',
    name: "Thumbnail Generation",
    version: "1.0.0",
    enabled: true,
    description: "Video thumbnail processing",
    backend: {
      routes: [
        { method: 'POST', path: '/api/thumbnails/generate', handler: 'thumbnail/generate.js' },
        { method: 'GET', path: '/api/thumbnails/:videoId', handler: 'thumbnail/get.js' },
      ]
    },
    config: {
      THUMBNAIL_WIDTH: 1280,
      THUMBNAIL_HEIGHT: 720
    },
    health: { endpoint: '/api/health/thumbnails' },
    dependencies: { requires: ['video-upload'] }
  },
  {
    id: 'user-settings',
    name: "User Settings",
    version: "1.0.0",
    enabled: true,
    description: "Account management and preferences",
    backend: {
      routes: [
        { method: 'GET', path: '/api/users/profile', handler: 'users/profile.js' },
        { method: 'PUT', path: '/api/users/profile', handler: 'users/update-profile.js' },
        { method: 'PUT', path: '/api/users/password', handler: 'users/change-password.js' },
        { method: 'DELETE', path: '/api/users/account', handler: 'users/delete-account.js' },
      ]
    },
    config: {},
    health: { endpoint: '/api/health/users' },
    dependencies: { requires: ['user-auth'] }
  },
];