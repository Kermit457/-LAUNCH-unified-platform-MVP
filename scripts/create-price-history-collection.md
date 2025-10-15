# Create Price History Collection in Appwrite

This script will guide you through creating the `price_history` collection in Appwrite Console.

## Prerequisites
- Access to your Appwrite Console
- Database: `launchos_db` (or your configured database)
- API Key with appropriate permissions

## Step 1: Navigate to Database
1. Open Appwrite Console: https://cloud.appwrite.io/console
2. Select your project
3. Go to **Databases** in the left sidebar
4. Select your database (default: `launchos_db`)

## Step 2: Create Collection
1. Click **"Add Collection"** button
2. Fill in the details:
   - **Collection ID**: `price_history` (MUST be exactly this)
   - **Collection Name**: `Price History`
3. Click **"Create"**

## Step 3: Add Attributes
Click **"Add Attribute"** and create these 4 attributes:

### Attribute 1: curveId
- **Key**: `curveId`
- **Type**: String
- **Size**: 256
- **Required**: ✓ Yes
- **Array**: ✗ No
- Click **"Create"**

### Attribute 2: supply
- **Key**: `supply`
- **Type**: Double (Float)
- **Required**: ✓ Yes
- **Min**: (leave empty)
- **Max**: (leave empty)
- Click **"Create"**

### Attribute 3: price
- **Key**: `price`
- **Type**: Double (Float)
- **Required**: ✓ Yes
- **Min**: (leave empty)
- **Max**: (leave empty)
- Click **"Create"**

### Attribute 4: timestamp
- **Key**: `timestamp`
- **Type**: String
- **Size**: 256
- **Required**: ✓ Yes
- **Array**: ✗ No
- Click **"Create"**

⏳ **Wait**: Appwrite will create each attribute. This may take a few seconds.

## Step 4: Create Indexes (Optional but Recommended)
Click **"Add Index"** and create these indexes for better performance:

### Index 1: curveId Index
- **Index Key**: `curveId_idx`
- **Index Type**: Key
- **Attributes**: Select `curveId`
- **Order**: ASC
- Click **"Create"**

### Index 2: timestamp Index
- **Index Key**: `timestamp_idx`
- **Index Type**: Key
- **Attributes**: Select `timestamp`
- **Order**: DESC (for sorting newest first)
- Click **"Create"**

### Index 3: Composite Index (Highly Recommended)
- **Index Key**: `curve_time_idx`
- **Index Type**: Key
- **Attributes**: Select `curveId`, then `timestamp`
- **Orders**: ASC for curveId, DESC for timestamp
- Click **"Create"**

⏳ **Wait**: Index creation may take a few moments.

## Step 5: Configure Permissions
1. Go to **Settings** tab in your collection
2. Scroll to **Permissions** section
3. Configure as follows:

### Create Permission
- Click **"Add Role"**
- Select: **Any** (or **Users** if you prefer more security)
- Check: **Create**
- Click **"Add"**

### Read Permission
- Click **"Add Role"**
- Select: **Any**
- Check: **Read**
- Click **"Add"**

### Update Permission
- Leave empty (we never update price history)

### Delete Permission
- Leave empty (or add admin role if needed for cleanup)

## Step 6: Verify Collection Structure
Your collection should now have:
- ✓ 4 Attributes: curveId, supply, price, timestamp
- ✓ 3 Indexes (optional but recommended)
- ✓ Permissions configured

## Step 7: Test the Integration
1. Save all changes in Appwrite Console
2. Go back to your application
3. Try buying or selling a key
4. Check the console logs - you should see:
   ```
   ✅ Solana transaction verified
   ✅ Price snapshot recorded successfully
   ```
5. No more "Collection not found" errors!

## Step 8: Verify Data is Being Recorded
1. Go back to Appwrite Console
2. Open the `price_history` collection
3. Click **"Documents"** tab
4. You should see price snapshots being created with each trade

## Expected Result
After completing these steps:
- ✅ Buy/Sell transactions will record price snapshots
- ✅ After 24 hours of trading, the 24h price change will appear on launch cards
- ✅ Price change badges will show: 🟢 +X.X% or 🔴 -X.X%
- ✅ Modal will display 24h price change below the main price

## Troubleshooting

### Error: "Collection with the requested ID could not be found"
- **Solution**: Make sure the Collection ID is exactly `price_history` (lowercase, underscore)

### Error: "Missing required attribute"
- **Solution**: Ensure all 4 attributes are created and marked as required

### No price change showing after 24 hours
- **Solution**: Check Documents tab to verify snapshots are being recorded
- **Solution**: Ensure at least one snapshot exists from 24h ago

### Permission denied errors
- **Solution**: Add "Any" role with Create and Read permissions

## Additional Notes
- Price snapshots are recorded automatically on every buy/sell transaction
- The system looks for a snapshot from 24h ago to calculate price change
- If no 24h snapshot exists, the card will show "X keys sold" as fallback
- Snapshots are never updated, only created (immutable price history)
- Consider setting up automated cleanup for very old snapshots (optional)

## Environment Variable (Optional)
If you want to use a custom collection ID, add to your `.env.local`:
```
NEXT_PUBLIC_APPWRITE_PRICE_HISTORY_COLLECTION_ID=your_custom_id
```

But using the default `price_history` is recommended.

---

**That's it!** Your 24h price change tracking is now fully functional. 🎉
