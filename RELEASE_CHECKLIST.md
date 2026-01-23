# NESA-Africa Release Checklist

## Pre-Release

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint passes with no critical errors
- [ ] No console.log statements in production code
- [ ] No hardcoded API keys or secrets
- [ ] All TODO comments addressed or documented

### Feature Completion
- [ ] Landing page renders correctly
- [ ] All sections display config-driven dates
- [ ] Stage gating works for all protected routes
- [ ] Nomination form functional (when stage open)
- [ ] Authentication flow working

### Testing
- [ ] Unit tests pass
- [ ] Manual QA completed (see QA_PLAN.md)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari, Android Chrome)

### Documentation
- [ ] README.md updated
- [ ] API.md reflects current endpoints
- [ ] ROUTES.md reflects current routes
- [ ] CHANGELOG.md updated with version notes

## Release Day

### Deployment
- [ ] Create backup of current production
- [ ] Deploy to production environment
- [ ] Verify deployment succeeded
- [ ] Run smoke tests on production URL

### Verification
- [ ] Landing page loads at production URL
- [ ] All navigation links work
- [ ] Stage banner reflects correct state
- [ ] Countdown timers accurate
- [ ] Form submissions work
- [ ] No JavaScript errors in console

### Communication
- [ ] Notify stakeholders of successful deployment
- [ ] Update status page (if applicable)
- [ ] Prepare rollback plan if issues arise

## Post-Release

### Monitoring (First 24 Hours)
- [ ] Monitor error logs
- [ ] Check analytics for unusual patterns
- [ ] Respond to user feedback
- [ ] Document any issues discovered

### Follow-up
- [ ] Review performance metrics
- [ ] Collect user feedback
- [ ] Plan next iteration
- [ ] Archive release documentation

## Emergency Rollback

If critical issues are found:

1. **Assess** - Determine severity and impact
2. **Communicate** - Notify team and stakeholders
3. **Rollback** - Revert to previous version in Lovable
4. **Verify** - Confirm rollback successful
5. **Document** - Record incident details
6. **Fix** - Address root cause before re-deploying
