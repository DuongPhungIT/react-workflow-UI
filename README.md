# React Follow UI - Modern Workflow Automation Library

Một thư viện React TypeScript hiện đại để xây dựng ứng dụng workflow automation tương tự n8n và Windmill, với khả năng hoạt động độc lập hoặc xuất bản thành thư viện.

## ✨ Tính năng

- 🎨 **UI hiện đại**: Sử dụng Less CSS với thiết kế đẹp và responsive
- 🔄 **Redux Saga**: Quản lý state với Redux Toolkit và Redux Saga
- 📦 **Cấu trúc rõ ràng**: Tổ chức code theo feature, component, utils, constants
- 🧩 **Component tái sử dụng**: Nhiều component có thể tái sử dụng (Button, Input, Card, Modal, Loading, etc.)
- 🎯 **React Flow**: Tích hợp React Flow (@xyflow/react) cho workflow editor - thư viện mạnh mẽ để xây dựng node-based UI
- 🛣️ **React Router**: Routing với URL support - `/workflow/:id` để xem và chỉnh sửa workflows
- 📚 **TypeScript**: Type-safe với TypeScript
- 🚀 **Vite**: Build tool hiện đại và nhanh
- 📦 **Library Mode**: Có thể xuất bản thành npm package
- 🎭 **Mock Data**: Có sẵn mock data để test và phát triển

## 📁 Cấu trúc thư mục

```
react-follow-UI/
├── src/
│   ├── components/          # Các component có thể tái sử dụng
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   └── styles.less
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Loading/
│   │   └── ErrorBoundary/
│   ├── features/           # Các tính năng chính
│   │   ├── WorkflowEditor/
│   │   │   ├── index.tsx
│   │   │   └── styles.less
│   │   └── WorkflowList/
│   ├── routes/             # React Router configuration
│   │   ├── index.tsx
│   │   └── AppLayout.tsx
│   ├── store/              # Redux store và sagas
│   │   ├── slices/         # Redux slices
│   │   ├── sagas/          # Redux sagas
│   │   ├── hooks.ts        # Typed Redux hooks
│   │   ├── index.ts        # Store configuration
│   │   ├── rootReducer.ts
│   │   └── rootSaga.ts
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── constants/          # Application constants
│   ├── types/              # TypeScript types
│   ├── mock/               # Mock data for development
│   │   └── data.ts
│   ├── styles/             # Global styles
│   │   ├── variables.less
│   │   └── index.less
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── index.ts            # Library exports
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Bắt đầu

### Cài đặt dependencies

```bash
npm install
```

### Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Routes

- `/` - Danh sách workflows
- `/workflow/:id` - Xem và chỉnh sửa workflow cụ thể
- `/workflow/new` - Tạo workflow mới

## 📦 Sử dụng như một thư viện

Sau khi build, bạn có thể import và sử dụng các component:

```typescript
import { Button, Input, Card, Modal } from 'react-follow-ui';
import { WorkflowEditor, WorkflowList } from 'react-follow-ui';
import { store } from 'react-follow-ui';
import { useAppDispatch, useAppSelector } from 'react-follow-ui';
```

## 🧩 Components

### Button

```tsx
import { Button } from 'react-follow-ui';

<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `fullWidth`: boolean

### Input

```tsx
import { Input } from 'react-follow-ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

### Card

```tsx
import { Card } from 'react-follow-ui';

<Card variant="elevated" padding="lg">
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

### Modal

```tsx
import { Modal } from 'react-follow-ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
</Modal>
```

### Loading

```tsx
import { Loading } from 'react-follow-ui';

<Loading size="md" text="Loading..." fullScreen />
```

## 🔄 Redux Store

### Sử dụng Redux hooks

```tsx
import { useAppDispatch, useAppSelector } from 'react-follow-ui';

function MyComponent() {
  const dispatch = useAppDispatch();
  const workflows = useAppSelector((state) => state.workflow.workflows);

  const handleFetch = () => {
    dispatch({ type: 'workflow/fetchWorkflows' });
  };

  return <div>...</div>;
}
```

### Store slices

- **appSlice**: Quản lý theme, sidebar, notifications, user preferences
- **workflowSlice**: Quản lý workflows, nodes, connections

### Sagas

- **appSaga**: Xử lý các side effects cho app
- **workflowSaga**: Xử lý các side effects cho workflow (fetch, create, update, delete)

## 🛠️ Utilities

### API Utils

```typescript
import { get, post, put, del } from 'react-follow-ui';

// GET request
const response = await get<User[]>('/users');

// POST request
const newUser = await post<User>('/users', { name: 'John' });

// PUT request
const updated = await put<User>('/users/1', { name: 'Jane' });

// DELETE request
await del('/users/1');
```

### Validation

```typescript
import { validateEmail, validatePassword, validateRequired } from 'react-follow-ui';

const emailResult = validateEmail('user@example.com');
if (!emailResult.isValid) {
  console.error(emailResult.error);
}
```

### Storage

```typescript
import { getStorageItem, setStorageItem, removeStorageItem } from 'react-follow-ui';

setStorageItem('key', { data: 'value' });
const value = getStorageItem('key');
removeStorageItem('key');
```

## 🎨 Styling

Dự án sử dụng Less CSS. Bạn có thể tùy chỉnh theme trong `src/styles/variables.less`:

```less
// Colors
@primary-600: #0284c7;
@primary-700: #0369a1;
// ... more colors

// Spacing
@spacing-md: 1rem;
@spacing-lg: 1.5rem;
// ... more spacing

// Border Radius
@radius-lg: 0.75rem;
// ... more radius
```

Các file Less được tổ chức như sau:
- `src/styles/variables.less` - Biến toàn cục (colors, spacing, shadows, etc.)
- `src/styles/index.less` - Styles chính và utility classes
- `src/components/*/styles.less` - Styles cho từng component
- `src/features/*/styles.less` - Styles cho từng feature

## 🛣️ Routing

Ứng dụng sử dụng React Router với các routes sau:

- `/` - Trang chủ, hiển thị danh sách workflows
- `/workflow/:id` - Xem và chỉnh sửa workflow cụ thể
- `/workflow/new` - Tạo workflow mới

URL sẽ tự động cập nhật khi bạn navigate giữa các trang, và bạn có thể share URL để truy cập trực tiếp vào workflow.

## 🎭 Mock Data

Dự án có sẵn mock data trong `src/mock/data.ts` với 4 workflows mẫu:
- Email Automation
- Data Processing Pipeline
- Social Media Scheduler
- Customer Onboarding

Mock data được sử dụng tự động trong development mode.

## 📝 Constants

Các constants được định nghĩa trong `src/constants/index.ts`:

- `API_CONFIG`: Cấu hình API
- `HTTP_STATUS`: HTTP status codes
- `ERROR_MESSAGES`: Error messages
- `SUCCESS_MESSAGES`: Success messages
- `STORAGE_KEYS`: LocalStorage keys
- `PAGINATION`: Pagination defaults
- `THEME`: Theme options
- `DATE_FORMATS`: Date format strings
- `VALIDATION`: Validation rules

## 🧪 Development

### Type checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### TypeScript Paths

Các path aliases đã được cấu hình trong `tsconfig.json`:

- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/features/*` → `src/features/*`
- `@/store/*` → `src/store/*`
- `@/utils/*` → `src/utils/*`
- `@/constants/*` → `src/constants/*`
- `@/hooks/*` → `src/hooks/*`
- `@/types/*` → `src/types/*`

## 📚 Dependencies chính

- **React 18**: UI library
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **Redux Saga**: Side effects
- **React Flow (@xyflow/react)**: Workflow editor - thư viện mạnh mẽ cho node-based UI
- **React Router DOM**: Routing và navigation
- **Vite**: Build tool
- **Less**: CSS preprocessor

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

MIT

## 🎯 Roadmap

- [ ] Thêm nhiều workflow node types
- [ ] Drag & drop cho workflow editor
- [ ] Export/Import workflows
- [ ] Workflow execution engine
- [ ] Real-time collaboration
- [ ] Plugin system
- [ ] Unit tests
- [ ] E2E tests
