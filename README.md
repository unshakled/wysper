# Wysper.link

<p align="center">
  <strong>Privacy-first, ephemeral messaging with 100% client-side encryption</strong>
</p>

<p align="center">
  <a href="https://github.com/unshakled/wysper/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/unshakled/wysper" alt="License">
  </a>
  <a href="https://github.com/unshakled/wysper/stargazers">
    <img src="https://img.shields.io/github/stars/unshakled/wysper" alt="Stars">
  </a>
  <a href="https://github.com/unshakled/wysper/network/members">
    <img src="https://img.shields.io/github/forks/unshakled/wysper" alt="Forks">
  </a>
  <a href="https://github.com/unshakled/wysper/issues">
    <img src="https://img.shields.io/github/issues/unshakled/wysper" alt="Issues">
  </a>
</p>

## 🔒 Overview

Wysper.link is a secure messaging platform that lets users create end-to-end encrypted, self-destructing messages. Built with a strong focus on privacy, all encryption happens in your browser using strong cryptographic algorithms (AES-GCM, PBKDF2). No data is ever stored on our servers - not your messages, not your passphrases, not even metadata.

## ✨ Key Features

- **Zero-Knowledge Architecture**: We can't read your messages even if we wanted to
- **Client-Side Encryption**: AES-GCM encryption with PBKDF2 key derivation (1,000,000 iterations)
- **Self-Destructing Messages**: Messages automatically disappear after viewing (configurable timer)
- **No Account Required**: Use immediately with no registration or tracking
- **Open Source**: Full code transparency - anyone can audit
- **No Data Storage**: Messages exist only as encrypted data in the URL itself
- **Passphrase Security**: Strong entropy validation with 7-word diceware passphrases

## 🚀 Quick Start

### Share a Secret Message

1. Go to [wysper.link](https://wysper.link)
2. Enter your message
3. Generate a secure 7-word passphrase (or create your own)
4. Set optional view self-destruct timer
5. Click "Generate Secure Link"
6. Share the link and passphrase separately through different channels

### Read a Secret Message

1. Open the Wysper link
2. Enter the passphrase
3. View the decrypted message before the self-destruct timer expires

## 🔐 Security Model

Wysper.link implements a comprehensive security model:

- **Message Encryption**: Uses AES-GCM with a 256-bit key
- **Key Derivation**: PBKDF2 with 1,000,000 iterations, SHA-256, and a random 16-byte salt
- **Initialization Vector**: Unique random 12-byte IV for each message
- **Expiration**: 7-day automatic expiration enforced client-side
- **Ephemeral Storage**: Data stored only in the URL fragment (never sent to server)
- **Content Security Policy**: Strict CSP preventing external resource loading

## 💻 Technical Implementation

Wysper.link is built with:

- Modern HTML5, CSS3, and vanilla JavaScript
- Web Cryptography API for secure client-side encryption
- EFF diceware wordlist for strong, memorable passphrases
- No frameworks, minimal dependencies for security

## 🛠️ Installation

To set up Wysper locally:

```bash
# Clone the repository
git clone https://github.com/unshakled/wysper.git
cd wysper

# Use your web server of choice
```

Then visit `http://localhost:8000` in your browser.

## 📋 Security Considerations

### What Wysper CAN Do

- ✅ Provide secure, encrypted communication
- ✅ Keep messages private even from the service operators
- ✅ Automatically destroy messages after viewing
- ✅ Help users generate strong passphrases
- ✅ Operate with complete transparency (open source)

### What Wysper CANNOT Do

- ❌ Protect against malware or keyloggers on your device
- ❌ Prevent social engineering attacks
- ❌ Secure your passphrase if you share it insecurely
- ❌ Recover lost passphrases (no backdoor by design)
- ❌ Control the recipient's device security

## 🧠 Security Best Practices

For maximum security when using Wysper:

1. **Share Separately**: Never send the link and passphrase through the same channel
2. **Use Trusted Channels**: Share passphrases via secure messaging apps like Signal
3. **Unique Passphrases**: Generate a new passphrase for each message
4. **Secure Device**: Ensure your device is free of malware and use a trusted browser
5. **Clear History**: Consider clearing browser history after creating or viewing messages

## 📜 License

Wysper is licensed under the GNU General Public License v3.0 (GPL-3.0). See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- EFF for their [large wordlist](https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt)
- The open-source cryptography community for security best practices
- All contributors who have helped improve Wysper.link

---

<p align="center">
  Made with ❤️ by <a href="https://unshakled.org">Unshakled Inc.</a>
</p>
