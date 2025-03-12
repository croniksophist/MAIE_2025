# Security Policy

## Reporting Vulnerabilities
If you discover a security issue, please email security@maieframework.org with details. We will acknowledge receipt within 24 hours.

## Supported Versions
| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |
| 0.x.x   | ❌ No     |

## Security Best Practices
- **Use strong passwords** and store credentials in a secure vault.
- **Enable MFA** for all access to critical systems.
- **Run security scans** using `bandit`, `safety`, and `detect-secrets`.
- **Apply security updates** regularly.

## Code Security Checks
All pull requests must pass:
- ✅ Static code analysis (`flake8`, `bandit`)
- ✅ Secret detection (`detect-secrets`)
- ✅ Dependency vulnerability scan (`safety check`)
