# Minimalist Clock

A beautiful, minimalist clock web application with customizable appearance and smooth page-flip animations.

## Features

- ⏰ Real-time clock display with hours and minutes
- 📅 Date display
- ✨ Smooth page-flip animation on minute change (GSAP)
- 🎨 Customizable font size, colors, and background
- 💾 Persistent user preferences (localStorage)
- 📱 Responsive design
- ♿ Accessibility features
- 🧪 Comprehensive test coverage
- 📚 Component documentation with Storybook

## Technology Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Styled Components
- **Animation**: GSAP
- **Testing**: Jest, React Testing Library, Cypress
- **Component Development**: Storybook
- **Deployment**: AWS S3 + CloudFront

## Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- AWS account (for deployment)

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd minimalist-clock

# Install dependencies
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running Storybook

View and develop components in isolation:

```bash
npm run storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run cypress` - Open Cypress interactive mode
- `npm run cypress:headless` - Run Cypress in headless mode
- `npm run storybook` - Start Storybook server
- `npm run build-storybook` - Build Storybook for production

## Project Structure

```
minimalist-clock/
├── .github/workflows/     # CI/CD pipelines
├── .storybook/           # Storybook configuration
├── app/                  # Next.js app directory
├── docs/                 # Documentation
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   ├── styles/          # Styled components and global styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── stories/             # Storybook stories
└── tests/
    ├── unit/            # Unit tests
    └── e2e/             # End-to-end tests
```

## Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### End-to-End Tests

```bash
# Open Cypress interactive mode
npm run cypress

# Run Cypress in headless mode
npm run cypress:headless
```

## Building for Production

Build the static site:

```bash
npm run build
```

The output will be in the `out/` directory.

## Deployment

The project uses GitHub Actions for CI/CD. On push to the main branch:
1. Runs linter and tests
2. Builds the application
3. Deploys to AWS S3
4. Invalidates CloudFront cache

### Required GitHub Secrets

Set these secrets in your GitHub repository settings:
- `AWS_ACCESS_KEY_ID` - AWS access key with S3 and CloudFront permissions
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `S3_BUCKET_NAME` - Name of your S3 bucket
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID

### AWS Setup

1. **Create S3 Bucket**:
   - Enable static website hosting
   - Configure bucket policy for public read access

2. **Create CloudFront Distribution**:
   - Set S3 bucket as origin
   - Configure SSL certificate using AWS Certificate Manager
   - Set up security headers

3. **Create IAM User**:
   - Grant permissions for S3 write and CloudFront invalidation
   - Generate access key for GitHub Actions

### Manual Deployment

```bash
# Build the application
npm run build

# Sync to S3 (requires AWS CLI configured)
aws s3 sync out/ s3://YOUR_BUCKET_NAME/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Documentation

- [Architecture](docs/architecture.md) - System architecture and design
- [Requirements](docs/requirements.md) - Project requirements and specifications

## License

This project is licensed under the MIT License.
