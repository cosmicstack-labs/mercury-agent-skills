---
name: android-kotlin-patterns
description: 'Jetpack Compose, MVVM, Room, Coroutines, DI with Dagger/Hilt, and Play Store submission'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: mobile
  tags: [android, kotlin, jetpack-compose, mobile, google]
---

# Android Kotlin Patterns

Production Android development with Kotlin and Jetpack.

## Architecture (Modern Android Dev)

### Recommended Stack
- **UI**: Jetpack Compose with Material 3
- **State**: ViewModel + StateFlow
- **DI**: Hilt/Dagger
- **DB**: Room
- **Network**: Retrofit + OkHttp
- **Async**: Coroutines + Flow
- **Navigation**: Compose Navigation

### Project Structure
```
app/
├── data/
│   ├── local/ (Room DAOs, entities)
│   ├── remote/ (Retrofit APIs, DTOs)
│   └── repository/
├── domain/
│   ├── model/
│   └── usecase/
├── ui/
│   ├── components/
│   ├── screens/
│   └── theme/
└── di/ (Hilt modules)
```

## Jetpack Compose Patterns

### State Hoisting
```kotlin
// State flows down, events flow up
@Composable
fun CounterScreen(viewModel: CounterViewModel = hiltViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    CounterContent(
        count = state.count,
        onIncrement = viewModel::increment
    )
}
```

### Performance
- Use `remember` and `derivedStateOf` for computations
- `LazyColumn` for lists, not `Column` with scrolling
- Stable types via `@Immutable`/`@Stable` annotations

## Play Store Submission
- [ ] Privacy Policy URL set
- [ ] App signing key backed up
- [ ] In-app reviews integrated
- [ ] Crash reporting (Firebase)
- [ ] proguard-rules.pro configured
- [ ] App bundles (.aab) for distribution
