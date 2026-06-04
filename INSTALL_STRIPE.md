# How to Install Stripe Dependencies

## Backend Installation (Spring Boot)

The Stripe Java SDK dependency has already been added to `pom.xml`. To install it:

### Option 1: Using Maven (Recommended)
```bash
cd challengeApp
mvn clean install
```

This will:
- Download the Stripe Java SDK (version 25.20.0)
- Compile your project
- Install all dependencies

### Option 2: Using Maven Wrapper (if Maven is not installed globally)
```bash
cd challengeApp
./mvnw clean install    # On Linux/Mac
# OR
mvnw.cmd clean install  # On Windows
```

### Option 3: Let IDE Download (if using IntelliJ IDEA or Eclipse)
- Open the project in your IDE
- The IDE will automatically detect the `pom.xml` changes
- It will prompt you to import Maven changes - click "Import" or "Reload"
- The dependencies will be downloaded automatically

### Verify Backend Installation
After running the install command, you should see:
- `BUILD SUCCESS` message
- No errors related to `com.stripe` imports
- The Stripe dependency in your IDE's external libraries

---

## Frontend Installation (React)

The Stripe React libraries have already been added to `package.json`. To install them:

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- `@stripe/stripe-js` (version ^2.2.0)
- `@stripe/react-stripe-js` (version ^2.4.0)
- All other dependencies

### Verify Frontend Installation
After running `npm install`, check:
- `node_modules` folder should contain `@stripe` packages
- No errors in the terminal
- You can verify by checking:
  ```bash
  npm list @stripe/stripe-js
  npm list @stripe/react-stripe-js
  ```

---

## Complete Installation Steps (Both)

### Windows (PowerShell)
```powershell
# Backend
cd challengeApp
mvn clean install

# Frontend
cd ..\frontend
npm install
```

### Linux/Mac (Terminal)
```bash
# Backend
cd challengeApp
mvn clean install

# Frontend
cd ../frontend
npm install
```

---

## Troubleshooting

### Backend Issues

**Problem: Maven command not found**
- Solution: Install Maven or use the Maven wrapper (`mvnw` or `mvnw.cmd`)

**Problem: Dependency download fails**
- Solution: Check your internet connection and Maven repository access
- Try: `mvn clean install -U` (forces update)

**Problem: Still seeing import errors after installation**
- Solution: 
  1. Refresh your IDE (IntelliJ: File → Invalidate Caches / Restart)
  2. Rebuild the project
  3. Ensure Maven dependencies are properly imported

### Frontend Issues

**Problem: npm install fails**
- Solution: 
  1. Delete `node_modules` folder and `package-lock.json`
  2. Run `npm install` again
  3. Or try: `npm install --legacy-peer-deps`

**Problem: Stripe packages not found**
- Solution:
  1. Verify they're in `package.json`
  2. Run `npm install` again
  3. Check `node_modules/@stripe` folder exists

**Problem: Version conflicts**
- Solution: Clear cache and reinstall
  ```bash
  npm cache clean --force
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## Quick Verification

### Backend Verification
Check if Stripe classes are available:
```bash
cd challengeApp
mvn dependency:tree | grep stripe
```
You should see: `com.stripe:stripe-java:jar:25.20.0`

### Frontend Verification
Check if Stripe packages are installed:
```bash
cd frontend
npm list @stripe/stripe-js @stripe/react-stripe-js
```

---

## After Installation

Once both are installed:

1. **Configure Stripe Keys:**
   - Backend: Update `challengeApp/src/main/resources/application.properties`
   - Frontend: Update `frontend/src/pages/PaymentPage.jsx`

2. **Start the Application:**
   ```bash
   # Terminal 1 - Backend
   cd challengeApp
   mvn spring-boot:run
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

3. **Test the Integration:**
   - Add items to cart
   - Proceed to checkout
   - Use test card: `4242 4242 4242 4242`

---

## Need Help?

- See `STRIPE_SETUP.md` for Stripe API key configuration
- Check Stripe documentation: https://stripe.com/docs
- Verify your `pom.xml` and `package.json` have the correct dependencies

