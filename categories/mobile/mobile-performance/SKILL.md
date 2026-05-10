---
name: mobile-performance
description: 'App startup, memory management, battery efficiency, network optimization, and profiling tools'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: mobile
  tags: [mobile, performance, profiling, optimization, ios, android]
---

# Mobile Performance

Profile, diagnose, and optimize mobile app performance.

## Key Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Cold Start | <1.5s | Xcode Organizer, Play Console |
| Warm Start | <0.5s | Systrace, os_signpost |
| Frames | 60fps (16ms) | Profile GPU, Perfetto |
| APK/IPA Size | <50MB | size-report, analyzer |
| Memory | <150MB | Xcode Memory Debugger, Memory Profiler |
| Network Latency | <200ms p95 | Proxyman, Charles |

## Startup Optimization

### iOS
- Reduce dynamic framework loading (prefer static libraries)
- Lazy-load non-critical services
- Profile with `Instruments - App Launch`
- Use `dispatch_once` for singletons

### Android
- Apply `App Startup` library for content providers
- Profile with `Android Studio - Startup Profiler`
- Use baseline profiles (Android 12+)
- Defer heavy init to background threads

## Memory Management
- Watch for retain cycles (weak/unowned references)
- Image caching: use NSCache/LruCache with size limits
- Monitor for OOMs in production with crash reporting
- Release view controllers when off-screen

## Network Optimization
- HTTP/2 multiplexing for concurrent requests
- Response caching with ETags
- Prefetch data predictively
- Compress with Brotli or gzip
- Use Protocol Buffers over JSON for large payloads
