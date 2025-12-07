# CI/CD Setup Guide

This document describes the CI/CD pipeline setup for the Minimalist Clock application.

## Overview

The CI/CD pipeline is implemented using GitHub Actions and automatically:
- Builds the application
- Runs linters and tests
- Deploys to AWS S3 + CloudFront (on main branch only)

## Workflow File

The workflow is defined in `.github/workflows/deploy.yml` and runs on:
- Every push to the `main` branch
- Every pull request targeting the `main` branch

## Pipeline Stages

### 1. Build and Test
- Checks out the code
- Sets up Node.js environment
- Installs dependencies
- Runs ESLint
- Builds the application
- Exports static site
- Uploads build artifacts

### 2. Deploy (main branch only)
- Downloads build artifacts
- Configures AWS credentials
- Syncs files to S3 bucket with appropriate cache headers
- Invalidates CloudFront cache

## Required GitHub Secrets

To enable deployment, configure the following secrets in your GitHub repository settings:

1. **AWS_ACCESS_KEY_ID**: AWS access key with permissions to write to S3 and invalidate CloudFront
2. **AWS_SECRET_ACCESS_KEY**: AWS secret access key
3. **AWS_REGION**: AWS region where your S3 bucket is located (e.g., `us-east-1`)
4. **S3_BUCKET_NAME**: Name of your S3 bucket
5. **CLOUDFRONT_DISTRIBUTION_ID**: CloudFront distribution ID

### Setting up GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each of the secrets listed above

## AWS Setup Requirements

### S3 Bucket Configuration
1. Create an S3 bucket for static website hosting
2. Enable static website hosting in bucket properties
3. Configure bucket policy to allow public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

### CloudFront Distribution
1. Create a CloudFront distribution with your S3 bucket as the origin
2. Configure SSL certificate using AWS Certificate Manager (ACM)
3. Set up custom domain if desired
4. Configure security headers:
   - Content-Security-Policy
   - X-Content-Type-Options
   - X-Frame-Options
   - Strict-Transport-Security

### IAM Policy for GitHub Actions
Create an IAM user with the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

## Cache Strategy

The deployment uses a two-pass cache strategy:

1. **Static assets** (JS, CSS, images): `public, max-age=31536000, immutable`
   - Long-term caching for fingerprinted assets
   
2. **HTML and JSON files**: `public, max-age=0, must-revalidate`
   - Always revalidate to ensure fresh content

## Local Testing

To test the build locally before pushing:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Build the application
npm run build

# Export static site
npm run export

# Test the output
cd out && npx serve
```

## Troubleshooting

### Build Fails
- Check Node.js version compatibility
- Ensure all dependencies are installed
- Review build logs in GitHub Actions

### Deployment Fails
- Verify AWS credentials are correct
- Check IAM permissions
- Ensure S3 bucket exists and is accessible
- Verify CloudFront distribution ID

### Cache Issues
- CloudFront cache invalidation may take 5-15 minutes
- Use versioned URLs for immediate updates
- Check CloudFront invalidation status in AWS Console

## Manual Deployment

To deploy manually:

```bash
# Build the application
npm run build
npm run export

# Sync to S3 (requires AWS CLI configured)
aws s3 sync out/ s3://YOUR_BUCKET_NAME/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```
