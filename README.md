# 3D Showcase Platform - Backend Progress

## Completed Modules

### Step 1 - Category Module

The Category module is responsible for organizing products into logical groups such as Furniture, Jewelry, Automotive, Architecture, etc.

### Implemented

- Create Category
- Get All Categories
- Get Single Category
- Update Category
- Delete Category

### Category Schema

- name
- slug
- description
- isActive
- createdBy
- updatedBy
- timestamps

### APIs

POST /api/category/create-category

GET /api/category/get-all

GET /api/category/get-category/:id

PUT /api/category/update-category/:id

DELETE /api/category/delete-category/:id

---

## Step 2 - Product Module

The Product module stores the main information of every showcase item.

At this stage only the product metadata is stored.

Images, Variants, Hotspots and 3D Models will be managed in separate modules.

### Implemented

- Create Product
- Get All Products
- Get Product
- Update Product
- Delete Product

### Product Schema

- name
- slug
- shortDescription
- description
- category (ObjectId)
- status
- featured
- viewCount
- createdBy
- updatedBy
- timestamps

### APIs

POST /api/product/create-product

GET /api/product/get-all

GET /api/product/get-product/:id

PUT /api/product/update/:id

DELETE /api/product/delete-product/:id

---

Current Progress

✅ Categories

✅ Products

⬜ Product Variants

⬜ Product Media

⬜ Product Hotspots

⬜ Collections


## Step 3 — Product Variants

Each product can have multiple variants.

Example

Modern Chair

↓

Black

White

Brown

Leather

Wood

Each variant can have its own

- Images
- 3D Model
- Material
- Color

(in next module)

### Features

- Create Variant
- Get Variants
- Get Variant
- Update Variant
- Delete Variant

### Fields

- Product
- Variant Name
- SKU
- Color
- Material
- Is Default
- Display Order
- Status

### APIs

POST    /api/variant/create-variant

GET     /api/variant/get-all

GET     /api/variant/get-variant/:id

PUT     /api/variant/update/:id

DELETE  /api/variant/delete/:id

---

# Database Structure

Category

↓

Product

↓

Product Variant

↓

Product Media

↓

Product Hotspots

---

Current Progress

✅ Categories

✅ Products

✅ Product Variants

⬜ Product Media

⬜ Product Hotspots

⬜ Collections


# Step 4 - Product Media Module

## Overview

The Product Media module manages all media files associated with a product variant.

Each variant can have:

- Multiple Gallery Images
- One 3D Model (.glb/.gltf)
- Cover Image (Future)
- Thumbnail Image (Future)

Media files are uploaded to Cloudinary and their metadata is stored in MongoDB.

---

# Flow

Category

↓

Product

↓

Product Variant

↓

Product Media

---

# Folder Structure

productMedia/

│── model
│      ProductMedia.js

│── controller
│      productMedia.controller.js

│── service
│      productMedia.service.js

│── validation
│      productMedia.validation.js

│── routes
│      productMedia.routes.js

middleware/

│── upload.js

config/

│── cloudinary.js

utils/

│── cloudinary.js

---

# Database Schema

## ProductMedia

| Field | Type | Description |
|--------|------|-------------|
| variant | ObjectId | Product Variant Reference |
| mediaType | String | image, model, cover, thumbnail |
| url | String | Cloudinary URL |
| publicId | String | Cloudinary Public ID |
| originalName | String | Original File Name |
| mimeType | String | File MIME Type |
| size | Number | File Size |
| isPrimary | Boolean | Primary Gallery Image |
| displayOrder | Number | Gallery Sorting Order |
| createdBy | ObjectId | Admin User |
| updatedBy | ObjectId | Updated By |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

---

# Cloudinary Folder Structure

3d-showcase/

    Product/

        Variant/

            images/

            model/

Example

3d-showcase/

    modern-chair/

        black/

            images/

                image1.jpg

                image2.jpg

            model/

                chair.glb

---

# Supported Files

Images

- jpg
- jpeg
- png
- webp

Models

- glb
- gltf

---

# Upload Strategy

Images

Browser

↓

Multer (Memory Storage)

↓

Buffer

↓

Cloudinary

↓

MongoDB

Model

Browser

↓

Multer

↓

Buffer

↓

Cloudinary (resource_type = raw)

↓

MongoDB

---

# APIs

## Upload Images

POST

/api/media/upload-images

Authentication Required

Body (form-data)

variant (Text)

images (File)

images (File)

images (File)

Response

201 Created

Uploads multiple gallery images for a Product Variant.

---

## Upload Model

POST

/api/media/upload-model

Authentication Required

Body (form-data)

variant (Text)

model (File)

Response

201 Created

Uploads a single GLB model for a Product Variant.

If a model already exists, it is replaced.

---

## Get Variant Media

GET

/api/media/variant/:variantId

Response

Returns

- Gallery Images
- Cover Image
- Thumbnail
- 3D Model

---

## Delete Media

DELETE

/api/media/:id

Authentication Required

Deletes

- Cloudinary File
- MongoDB Record

---

## Set Primary Image

PATCH

/api/media/set-primary/:id

Authentication Required

Marks one gallery image as the primary image.

Automatically removes the previous primary image.

---

## Reorder Images

PATCH

/api/media/reorder

Authentication Required

Example

{
    "images":[

        {
            "id":"imageId1",
            "displayOrder":1
        },

        {
            "id":"imageId2",
            "displayOrder":2
        }

    ]
}

Used for drag-and-drop gallery ordering.

---

# Features Completed

✅ Upload Multiple Images

✅ Upload GLB Model

✅ Get Variant Media

✅ Delete Media

✅ Set Primary Image

✅ Reorder Images

---

# Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- Cloudinary
- Streamifier
- JWT Authentication

---

# Module Status

✅ Completed

---

# Next Module

Step 5

Product Hotspots

Features

- Create Hotspot
- Update Hotspot
- Delete Hotspot
- Get Hotspots by Variant
- Store 3D Coordinates (x, y, z)
- Clickable Annotations for Three.js Viewer



# Product Hotspots Module

## Overview

The Product Hotspots module allows administrators to place interactive markers on a 3D model.

Each hotspot contains:

- Title
- Description
- Position (x, y, z)
- Icon
- Color
- Visibility
- Display Order

Hotspots are attached to a Product Variant.

---

# Folder Structure

productHotspot/

│── model
│      ProductHotspot.js

│── controller
│      productHotspot.controller.js

│── service
│      productHotspot.service.js

│── validation
│      productHotspot.validation.js

│── routes
│      productHotspot.routes.js

---

# Database Flow

Category

↓

Product

↓

Variant

↓

Media

↓

Hotspots

---

# APIs

POST

/create-hotspot

Creates a hotspot.

---

GET

/variant/:variantId

Returns all hotspots of a variant.

---

GET

/:id

Returns a single hotspot.

---

PUT

/update/:id

Updates hotspot details.

---

DELETE

/delete/:id

Deletes a hotspot.

---

PATCH

/reorder

Updates hotspot display order.

---

# Position

Hotspot position uses Three.js world coordinates.

Example

position

x = 0.45

y = 1.20

z = -0.30

These coordinates are generated by the frontend when the admin clicks on the 3D model.

---

# Status

✅ Completed