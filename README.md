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
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library

### Components
- **Rotating Carousel**: 3D card carousel with hover interactions
- **Role Cards**: Dynamic contributor cards with real-time data
- **Elegant Button**: Custom styled button with hover effects
- **Commit Dropdown**: Collapsible commit history viewer

## 📁 Project Structure

```
collablens/
├── app/
│   ├── api/
│   │   └── repo-data/
│   │       └── route.ts      # API endpoint for repo data
│   ├── contributor/
│   │   └── [username]/
│   │       └── page.tsx      # Contributor detail page
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard with carousel
│   ├── landing/
│   │   ├── layout.tsx
│   │   └── page.tsx          # Landing page
│   ├── globals.css
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── carousel-card.tsx     # Individual contributor cards
│   ├── rotating-carousel.tsx # 3D carousel component
│   ├── elegant-button.tsx    # Custom button component
│   ├── CommitDropdown.tsx    # Commit history viewer
│   └── useCollabLensData.ts  # Data fetching hook
├── data/
│   └── carousel-items.ts     # Type definitions
└── public/
    └── images/               # Role-specific images
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
   npm install
   ```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

## 🔧 Configuration

### Customization

#### Adding New Role Images
1. Add image to `public/images/`
2. Update `roleImages` in `components/carousel-card.tsx`

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
