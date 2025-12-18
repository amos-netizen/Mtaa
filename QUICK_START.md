# ⚡ Quick Start - Real-World Services Feature

## 🚀 **One-Command Setup**

```bash
cd apps/backend && ./scripts/setup-places.sh
```

**That's it!** The script will handle everything.

---

## 📋 **What You Need**

1. **Database Connection**: Make sure `DATABASE_URL` is set in `.env.local` or `.env`
   ```bash
   # Check if set
   cd apps/backend
   cat .env.local | grep DATABASE_URL
   ```

2. **PostgreSQL Database**: The feature requires PostgreSQL (not SQLite)

---

## ✅ **After Setup**

1. **Restart Backend:**
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **Test It:**
   - Go to: `http://localhost:3000/nearby`
   - Enable location
   - Search: "hospital" or "pharmacy"

---

## 🆘 **If Setup Fails**

See `COMPLETE_SETUP_INSTRUCTIONS.md` for detailed troubleshooting.

---

**Ready to go!** 🎉

