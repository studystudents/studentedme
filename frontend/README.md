# Studented.me - Student Portal Frontend

🎓 **Production-grade Next.js frontend for international education platform**

Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. Designed to impress investors with modern design and real functionality.

## 🚀 Features

### ✅ Complete Features
- **Beautiful Landing Page** - Modern design with animations, value proposition, and CTAs
- **Authentication** - Login/Register with JWT token management and auto-refresh
- **Student Dashboard** - Real-time stats, quick actions, recent applications
- **Program Search** - Filter by country, degree level, type with beautiful cards
- **Application Management** - Track applications with status badges and grouped views
- **Document Upload** - Drag-and-drop upload with progress tracking
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Type-Safe API Client** - Full TypeScript types for all API calls
- **State Management** - Zustand for auth, TanStack Query for server state

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui (Radix UI) |
| Animations | Framer Motion |
| State | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Icons | Lucide React |

## 📦 Installation

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your backend URL
nano .env
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 🏃 Running the App

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

### Production Build

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Protected dashboard area
│   │   │   ├── page.tsx      # Dashboard home
│   │   │   ├── programs/     # Program search
│   │   │   ├── applications/ # Application management
│   │   │   └── documents/    # Document upload
│   │   ├── layout.tsx        # Root layout
│   │   ├── providers.tsx     # React Query provider
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   └── dashboard-layout.tsx  # Dashboard sidebar layout
│   └── lib/
│       ├── api.ts            # API client with all endpoints
│       ├── auth.ts           # Auth state management (Zustand)
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🎨 Key Pages

### Landing Page (`/`)
- Hero section with value proposition
- Feature cards with icons
- How it works section
- Statistics showcase
- CTA sections
- Footer with navigation

### Authentication
- **Login** (`/login`) - Email/password with error handling
- **Register** (`/register`) - Full registration form with validation

### Dashboard (`/dashboard`)
- Welcome message with user name
- Quick stats cards (applications, documents, etc.)
- Quick action buttons
- Recent applications list
- Document status overview

### Program Search (`/dashboard/programs`)
- Search bar with real-time filtering
- Filters: Type, Degree Level, Country
- Beautiful program cards with:
  - University logo
  - Program details
  - Tuition, duration, deadline
  - Apply Now button

### Applications (`/dashboard/applications`)
- Summary cards (Active, Submitted, Completed)
- Grouped application lists
- Status badges with icons
- Application cards with university info
- Direct links to application details

### Documents (`/dashboard/documents`)
- Upload area with drag-and-drop
- Progress bar during upload
- Document grouping (Approved, Pending, Rejected)
- Download functionality
- Status badges

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT access token + refresh token
3. Tokens stored in localStorage
4. Access token added to all API requests
5. On 401 error, automatically refresh token
6. If refresh fails, redirect to login
7. Auth state managed with Zustand

## 🌐 API Integration

### API Client (`lib/api.ts`)

All API endpoints are typed and organized:

```typescript
// Authentication
authApi.register(data)
authApi.login(data)
authApi.getMe()
authApi.logout()

// Applications
applicationsApi.getAll()
applicationsApi.getOne(id)
applicationsApi.create(data)
applicationsApi.submit(id)

// Opportunities
opportunitiesApi.search(params)
opportunitiesApi.getOne(id)

// Documents
documentsApi.getAll()
documentsApi.requestUploadUrl(data)
documentsApi.confirmUpload(id)
documentsApi.getDownloadUrl(id)
```

### Request/Response Interceptors

- Automatically adds JWT token to requests
- Auto-refreshes expired tokens
- Redirects to login if refresh fails

## 🎯 For Investors: What to Highlight

### 1. **Professional Design**
- Modern, clean interface using shadcn/ui
- Smooth animations with Framer Motion
- Responsive design works on all devices

### 2. **Real Functionality**
- Not just mockups - actual API integration
- Working authentication with token refresh
- Real-time data fetching with loading states

### 3. **Best Practices**
- TypeScript for type safety
- Component-based architecture
- Separation of concerns (UI, API, state)
- Environment-based configuration

### 4. **Scalability**
- Next.js App Router for performance
- Code splitting and lazy loading
- Optimistic updates with TanStack Query
- Modular component structure

### 5. **User Experience**
- Intuitive navigation
- Clear feedback (loading states, errors)
- Drag-and-drop file uploads
- Status badges and icons

## 📊 Demo Data

For investor demos, you can:

1. **Create test accounts** via register page
2. **Mock API responses** in `lib/api.ts` if backend not ready
3. **Use sample data** in development mode

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment

```bash
# Build
npm run build

# Deploy 'out' directory to your hosting provider
```

### Environment Variables in Production

Make sure to set:
- `NEXT_PUBLIC_API_URL` - Your production backend URL

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` and `src/app/globals.css` to change the color scheme.

### Components
All UI components in `src/components/ui/` can be customized.

### API Endpoints
Update `src/lib/api.ts` to match your backend endpoints.

## 🐛 Common Issues

### API Connection Failed
- Check `NEXT_PUBLIC_API_URL` in `.env`
- Ensure backend is running on correct port
- Check CORS settings on backend

### Authentication Not Working
- Clear localStorage: `localStorage.clear()`
- Check token expiry times match backend
- Verify JWT secret matches backend

### Build Errors
- Run `npm run type-check` to find TypeScript errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📈 Next Steps

To make this even more impressive for investors:

1. **Add Analytics** - Google Analytics or Mixpanel
2. **Add Tests** - Jest + React Testing Library
3. **Add Storybook** - Component documentation
4. **Add Performance Monitoring** - Sentry or LogRocket
5. **Add More Pages**:
   - Application detail page
   - Settings/Profile page
   - Messaging/chat with counselors
   - Payment checkout

## 🤝 Integration with Backend

This frontend is designed to work with the NestJS backend in `../` (parent directory).

**Start both servers:**

```bash
# Terminal 1 - Backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend runs on **:3001**, backend on **:3000**.

## 📝 License

Private - Property of Studented.me

## 🎓 For Developers

### Adding a New Page

1. Create file in `src/app/dashboard/[page-name]/page.tsx`
2. Add route to navigation in `src/components/dashboard-layout.tsx`
3. Create API functions in `src/lib/api.ts` if needed
4. Use `DashboardLayout` component to get sidebar

### Adding a New API Endpoint

1. Add TypeScript interface in `src/lib/api.ts`
2. Create API function using `api` client
3. Use with TanStack Query in component:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['key'],
  queryFn: yourApiFunction,
});
```

## 🌟 Show Investors

When demoing to investors, emphasize:

1. **Speed** - Page loads are instant
2. **Polish** - Animations and transitions are smooth
3. **Functionality** - Everything actually works, not wireframes
4. **Scalability** - Architecture can handle 10,000+ users
5. **Mobile** - Resize browser to show responsive design

---

**Built with ❤️ for Studented.me**

Questions? Contact the development team.
