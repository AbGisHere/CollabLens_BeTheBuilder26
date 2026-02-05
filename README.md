# CollabLens

A collaborative team visualization tool that analyzes GitHub repository data and assigns roles to contributors based on their activity patterns.

## 🚀 Features

- **Role Assignment**: Automatically assigns 6 specialized roles (Forge, Compass, Sentinel, Catalyst, Anchor, Parasite) based on contributor metrics
- **Dynamic Carousel**: 3D rotating carousel displaying all team members with role-specific styling
- **Interactive Landing**: Smooth scroll animation revealing demo access
- **Real-time Data**: Processes commit history, activity patterns, and contribution metrics

## 🎭 Role Definitions

- **Forge**: Highest commits/additions - Master craftsman building innovative solutions
- **Compass**: Most active weeks - Strategic navigator guiding team direction  
- **Sentinel**: Highest deletions ratio - Vigilant guardian protecting code quality
- **Catalyst**: Burst commits - Change agent accelerating transformation
- **Anchor**: Longest timeline - Reliable foundation keeping team grounded
- **Parasite**: Lowest overall - Adaptive specialist thriving in any environment
- **Common**: Remaining contributors - Essential collaborators supporting team

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions

### Components
- **Rotating Carousel**: 3D card carousel with hover interactions
- **Role Cards**: Dynamic contributor cards with real-time data
- **Elegant Button**: Custom styled button with hover effects
- **Commit Dropdown**: Collapsible commit history viewer

### Backend
- **Node.js** - Server runtime
- **TypeScript** - Type-safe backend development
- **GitHub API** - Repository data fetching
- **Role Assignment Algorithm**: Custom logic for contributor analysis

## 📁 Project Structure

```
collablens/
├── Frontend/
│   ├── app/
│   │   ├── landing/
│   │   └── page.tsx          # Landing page with scroll animation
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard with carousel
│   └── layout.tsx              # Root layout
│   ├── components/
│   │   ├── carousel-card.tsx     # Individual contributor cards
│   │   ├── rotating-carousel.tsx # 3D carousel component
│   │   ├── elegant-button.tsx   # Custom button component
│   │   ├── commit-dropdown.tsx  # Commit history viewer
│   │   └── useCollabLensData.ts # Data fetching hook
│   ├── data/
│   │   └── carousel-items.ts     # Type definitions
│   └── public/
│       └── images/             # Role-specific images
│           ├── Forge.png
│           ├── Compass.png
│           └── Parasite.png
└── Backend/
    ├── .env.example           # Environment variables template
    └── [server files]       # API endpoints and data processing
```

## 🚀 Deployment

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub repository access (for data fetching)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collablens
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd Frontend
   npm install
   
   # Backend (if applicable)
   cd ../Backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Development Deployment

#### Option 1: Local Development
```bash
# Start Frontend
cd Frontend
npm run dev

# Start Backend (in separate terminal)
cd Backend
npm run dev
```

#### Option 2: Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

#### Option 3: Vercel (Recommended for Frontend)
```bash
# Deploy frontend to Vercel
cd Frontend
npm run build
vercel --prod

# Configure environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=your-backend-url
```

#### Option 4: Railway/Render (Backend)
```bash
# Deploy backend to Railway/Render
cd Backend
npm run build
railway up  # or render deploy

# Configure environment variables
GITHUB_TOKEN=your-github-token
PORT=3001
```

### Production Deployment

#### Full Stack Deployment
```bash
# 1. Deploy Backend First
# Deploy to Railway/Render
# Note the backend URL

# 2. Configure Frontend
# Update NEXT_PUBLIC_API_URL in frontend/.env.local
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# 3. Deploy Frontend
# Deploy to Vercel/Netlify
cd Frontend
npm run build
vercel --prod
```

## 🔧 Configuration

### Environment Variables

#### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3001  # Backend API URL
NEXT_PUBLIC_APP_NAME=CollabLens       # Application name
```

#### Backend
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxx        # GitHub personal access token
PORT=3001                           # Server port
NODE_ENV=production                   # Environment mode
```

### Customization

#### Adding New Role Images
1. Add image to `Frontend/public/images/`
2. Update `roleImages` in `components/carousel-card.tsx`:
   ```typescript
   const roleImages = {
     // ...existing roles
     newRole: "/images/NewRole.png"
   }
   ```

#### Modifying Role Assignment
Update the `assignRoles` function in `components/useCollabLensData.ts` to customize role assignment logic.

#### Styling Changes
- Modify color schemes in `components/carousel-card.tsx`
- Update animations in `components/rotating-carousel.tsx`
- Adjust layout in `app/landing/page.tsx`

## 🐛 Troubleshooting

### Common Issues

**Carousel Not Loading**
- Check if `useCollabLensData` is fetching data correctly
- Verify API endpoints are accessible
- Ensure role assignment logic completes

**Images Not Displaying**
- Confirm images are in `public/images/`
- Check file paths in `roleImages` mapping
- Verify image formats (PNG recommended)

**Scroll Animation Issues**
- Ensure main container has `position: fixed`
- Check `overflow: hidden` is applied
- Verify transform values match screen dimensions

**Deployment Issues**
- Clear Next.js cache: `rm -rf .next`
- Verify environment variables
- Check build logs for errors

## 📊 Monitoring

### Performance Metrics
- Monitor carousel performance with different team sizes
- Track API response times
- Measure animation frame rates

### Analytics Integration
```typescript
// Add analytics tracking
const handleSeeDemo = () => {
  analytics.track('demo_viewed', { source: 'landing_page' })
  window.location.href = '/dashboard'
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Submit pull request with detailed description
5. Follow code style and conventions

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create GitHub issue
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ for collaborative teams everywhere**
