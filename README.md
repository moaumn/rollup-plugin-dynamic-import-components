# rollup-plugin-dynamic-import-components
动态引入Vue插件

在Vue中使用import()函数动态加载组件时，参数只能是明确的组件文件地址，无法写逻辑动态加载组件，因为编译器在编译时需要获取组件，进行预编译。
使用该插件将动态加载组件的逻辑定义在插件配置中，代码中使用dynamicImportComponents宏，编译前其替换为定义的加载方法的返回值。


1. 配置vite.config.ts
```typescript
import DynamicImportComponentsPluggin from "rollup-plugin-dynamic-import-components";
export default defineConfig({
    plugins:[
        DynamicImportComponentsPluggin({
            // component为自定义的类型，加载方法支持任意多的参数
            'component': (name: string) => {
                return `() => {import('/components/${name}.css'); return import('/components/${name}.vue');}`
            },
            // ... other type config
        })
    ]
});
```

2. 在代码中使用
```typescript
const a = dynamicImportComponents('component', 'button');
```

3. 编译后
```typescript
const a = () => {
    import('/components/button.css');
    return import('/components/button.vue');
}
```