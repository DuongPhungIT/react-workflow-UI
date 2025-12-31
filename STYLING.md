# Hướng dẫn Styling với Less

Dự án sử dụng Less CSS thay vì Tailwind CSS. Tất cả styles được viết bằng Less và tổ chức theo cấu trúc rõ ràng.

## Cấu trúc Files Less

```
src/
├── styles/
│   ├── variables.less      # Biến toàn cục (colors, spacing, shadows, etc.)
│   └── index.less          # Styles chính và utility classes
├── components/
│   ├── Button/
│   │   └── Button.less     # Styles cho Button component
│   ├── Input/
│   │   └── Input.less      # Styles cho Input component
│   └── ...
└── features/
    ├── WorkflowList/
    │   └── WorkflowList.less
    └── ...
```

## Biến (Variables)

Tất cả biến được định nghĩa trong `src/styles/variables.less`:

### Colors
```less
@primary-600: #0284c7;
@primary-700: #0369a1;
@gray-50: #f9fafb;
@gray-100: #f3f4f6;
// ...
```

### Spacing
```less
@spacing-xs: 0.25rem;
@spacing-sm: 0.5rem;
@spacing-md: 1rem;
@spacing-lg: 1.5rem;
```

### Shadows
```less
@shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
@shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
@shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

## Sử dụng trong Component

### Import variables
```less
@import '../../styles/variables.less';

.my-component {
  background-color: @primary-600;
  padding: @spacing-md;
  box-shadow: @shadow-md;
}
```

### BEM naming convention
```less
.button {
  // Block
  display: inline-flex;
  
  &--primary {
    // Modifier
    background-color: @primary-600;
  }
  
  &--sm {
    // Modifier
    padding: 0.375rem 0.75rem;
  }
  
  &__spinner {
    // Element
    margin-right: @spacing-sm;
  }
}
```

## Utility Classes

Các utility classes được định nghĩa trong `src/styles/index.less`:

- `.flex`, `.flex-col` - Flexbox utilities
- `.items-center`, `.justify-center` - Alignment utilities
- `.p-4`, `.m-4`, `.mt-2` - Spacing utilities
- `.text-center`, `.text-sm` - Typography utilities
- `.bg-white`, `.text-gray-900` - Color utilities
- `.rounded`, `.rounded-lg` - Border radius utilities
- `.shadow-md`, `.shadow-lg` - Shadow utilities

## Responsive Design

Sử dụng media queries trong Less:

```less
.my-component {
  padding: @spacing-md;
  
  @media (min-width: 768px) {
    padding: @spacing-lg;
  }
  
  @media (min-width: 1024px) {
    padding: @spacing-xl;
  }
}
```

## Best Practices

1. **Luôn import variables**: Sử dụng biến thay vì hardcode values
2. **BEM naming**: Sử dụng BEM cho component styles
3. **Nested selectors**: Tận dụng nested selectors của Less
4. **Mixins**: Tạo mixins cho code tái sử dụng
5. **Organize**: Giữ styles gần với component/feature

## Ví dụ Mixin

```less
// Trong variables.less
.transition(@property: all, @duration: 200ms) {
  transition: @property @duration ease-in-out;
}

// Sử dụng
.button {
  .transition(background-color, 150ms);
}
```

## Tùy chỉnh Theme

Để thay đổi theme, chỉnh sửa các biến trong `src/styles/variables.less`:

```less
// Thay đổi primary color
@primary-600: #your-color;

// Thay đổi spacing scale
@spacing-md: 1.25rem;

// Thay đổi border radius
@radius-lg: 1rem;
```


