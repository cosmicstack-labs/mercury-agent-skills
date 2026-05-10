---
name: ios-swift-patterns
description: 'SwiftUI, UIKit, MVVM, Combine, async/await, Core Data, and App Store submission patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: mobile
  tags: [ios, swift, swiftui, uikit, mobile, apple]
---

# iOS Swift Patterns

Production-grade iOS development with Swift, SwiftUI, and UIKit.

## Architecture

### MVVM + Coordinator Pattern
```
View (SwiftUI/UIViewController)
  ↕ binds to
ViewModel (ObservableObject)
  ↕ calls
Service Layer (Networking, DB)
  ↕
Core Data / API
```

### Key Principles
- **Views are dumb**: They render state and forward actions — no business logic
- **ViewModels own state**: `@Published` properties, `@State` only for local UI
- **Services are stateless**: Network calls, DB operations, analytics
- **Coordinators handle navigation**: Removing navigation from views makes them reusable

## SwiftUI Best Practices

### Performance
- Use `LazyVStack`/`LazyHStack` for large lists, not `VStack`
- Mark views with `@MainActor` explicitly
- Use `equatable()` on complex views to prevent unnecessary re-renders
- Prefer `@State` for local, `@StateObject` for owned, `@ObservedObject` for passed-in

### State Management
```swift
// Good: Clear separation
@MainActor
class UserViewModel: ObservableObject {
    @Published var users: [User] = []
    @Published var isLoading = false

    func loadUsers() async {
        isLoading = true
        users = await userService.fetchUsers()
        isLoading = false
    }
}
```

## App Store Submission Checklist
- [ ] No Hardcoded API keys
- [ ] TestFlight beta tested with real users
- [ ] Privacy manifest updated
- [ ] Screenshots for all required sizes
- [ ] App Store description and keywords ready
- [ ] Subscription/IAP products configured
