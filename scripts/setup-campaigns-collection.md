# Setup Campaigns Collection in Appwrite

## Required Attributes for `campaigns` Collection

Go to: https://fra.cloud.appwrite.io/console/project-68e34a030010f2321359/databases/database-launchos_db/collection-campaigns/settings

### String Attributes
1. **campaignId** (String, Required, Size: 255)
2. **type** (String, Required, Size: 50, Default: "clipping")
3. **title** (String, Required, Size: 255)
4. **description** (String, Required, Size: 5000, Default: "")
5. **createdBy** (String, Required, Size: 255)
6. **status** (String, Required, Size: 50, Default: "active")
7. **gdocUrl** (String, Required, Size: 500, Default: "")
8. **imageUrl** (String, Required, Size: 500, Default: "")
9. **ownerType** (String, Required, Size: 20, Default: "user")
10. **ownerId** (String, Required, Size: 255)

### Integer/Double Attributes
11. **prizePool** (Double, Required, Min: 0, Default: 0)
12. **budgetTotal** (Double, Required, Min: 0, Default: 0)
13. **ratePerThousand** (Double, Required, Min: 0, Default: 0)
14. **minViews** (Integer, Required, Min: 0, Default: 0)
15. **minDuration** (Integer, Required, Min: 0, Default: 0)
16. **maxDuration** (Integer, Required, Min: 0, Default: 0)

### Array Attributes
17. **platforms** (String Array, Required, Default: [])
18. **socialLinks** (String Array, Required, Default: [])

## Indexes to Create

1. **idx_campaignId**
   - Type: Key
   - Attributes: campaignId (ASC)

2. **idx_status**
   - Type: Key
   - Attributes: status (ASC)

3. **idx_createdBy**
   - Type: Key
   - Attributes: createdBy (ASC)

4. **idx_owner**
   - Type: Key
   - Attributes: ownerType (ASC), ownerId (ASC)

5. **idx_type**
   - Type: Key
   - Attributes: type (ASC)

## Quick Steps

1. Open Appwrite Console → Databases → launchos_db → campaigns → Attributes
2. Click "Create attribute" for each attribute above
3. After all attributes are created, go to Indexes tab
4. Create the 5 indexes listed above

## Validation

After setup, these fields should exist:
- ✅ campaignId
- ✅ type
- ✅ title
- ✅ description
- ✅ createdBy
- ✅ status
- ✅ prizePool
- ✅ budgetTotal
- ✅ ratePerThousand
- ✅ minViews
- ✅ minDuration
- ✅ maxDuration
- ✅ platforms (array)
- ✅ socialLinks (array)
- ✅ gdocUrl
- ✅ imageUrl
- ✅ ownerType
- ✅ ownerId