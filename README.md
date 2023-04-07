# rollup-plugin-dynamic-import-component
A Rollup plugin that dynamically imports Vue components.
In Vue, when using the import function to dynamically load Vue components, the parameter can only be a string. This is because the Vue compiler needs to obtain the path of the component file at compile time to compile the component.

vite.config.ts
```typescript
import DynamicImportComponentPluggin from "rollup-plugin-dynamic-import-component";
export default defineConfig({
    plugins:[
        DynamicImportComponentPluggin({
            'component': (name: string) => {
                return `() => {import('/components/${name}.css'); return import('/components/${name}.vue');}`
            },
            // ... other type config
        })
    ]
});
```

Transform 
```typescript
const a = dynamicImportComponent('component', 'button');
```
To
```typescript
const a = () => {
    import('/components/button.css');
    return import('/components/button.vue');
}
```