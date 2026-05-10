---
name: react-native-patterns
description: 'Navigation, state management, native modules, performance, animations, and cross-platform strategies'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: mobile
  tags: [react-native, mobile, cross-platform, javascript, react]
---

# React Native Patterns

Build performant cross-platform mobile apps with React Native.

## Architecture

### Project Structure
```
src/
├── components/    # Reusable UI components
├── screens/       # Screen-level components
├── navigation/    # React Navigation config
├── services/      # API, storage, native modules
├── hooks/         # Custom hooks
├── store/         # State management
├── utils/         # Helpers
└── types/         # TypeScript types
```

### Navigation (React Navigation)
```typescript
// Stack + Tab pattern
const RootStack = createNativeStackNavigator();
const MainTabs = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen name="Details" component={DetailsScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
```

## Performance

### Key Optimizations
- `React.memo` for pure components
- `useMemo`/`useCallback` for expensive computations
- `FlatList` with `getItemLayout` for perf
- Image caching with `react-native-fast-image`
- Hermes engine for Android
- Remove console.logs in production

### Native Modules
Use Turbo Modules (New Architecture) for bridging:

```typescript
// NativeModule.ts
import { TurboModuleRegistry } from 'react-native';
export default TurboModuleRegistry.getEnforcing('MyCustomModule');
```

## Cross-Platform Strategy
- Write once, customize per platform with `.ios.tsx`/`.android.tsx` extensions
- Use Platform.select for minor differences
- Test on both platforms before every release
