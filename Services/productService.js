import productModel from "../models/product.js";
import imageModel from "../models/imageModel.js"
import ProductCategoryRelation from "../models/productCategoryRelation.js";

export const createProduct = async (productData, next) => {
  try {
    const product = await productModel.create({
      productName: productData.productName,
      description: productData.description,
      price: productData.price,
      quantity: productData.quantity
    });
    return product;
  } catch (error) {
    next(error);
  }
};

// Function to save image URLs with product ID in product image collection
export const saveImageUrls = async (productId, imageUrls, next) => {
  try {
    const imageDocs = imageUrls.map(imageUrls => ({
      productId,
      imageUrls
    }));
    await imageModel.insertMany(imageDocs);
  } catch (error) {
    next(error);
  }
};

export const createProductCategoryRelations = async (productId, category, next) => {
  try {
    const relations = category.map(categoryId => ({
      productId,
      categoryId
    }));
    await ProductCategoryRelation.insertMany(relations);
  } catch (error) {
    next(error);
  }
};


export const getAllProducts = async () => {
  return await productModel.find();
}

export const getProductsWithResponce = async (productSorting, productSearching) => {
  const { limit, skip, sortOptions } = productSorting;
  const productData = await productModel.aggregate([

    {
      $lookup: {
        from: "productimages", // Name of the product image collection
        localField: "_id",
        foreignField: "productId",
        as: "imagesUrl"
      }
    },

    {
      $lookup: {
        from: "productcategoryrelations",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$productId", "$$productId"] }
            }
          },

          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "productCategories"
            }
          },


          {
            $project: {
              _id: { $arrayElemAt: ["$productCategories._id", 0] },
              categoryName: { $arrayElemAt: ["$productCategories.categoryName", 0] },

            }
          },

        ],
        as: "productCatlogRelation"
      }
    },

    {
      $match: { ...productSearching } // Apply the dynamic match query
    },

    {
      $project: {
        _id: 1,
        productName: 1,
        description: 1,
        price: 1,
        quantity: 1,
        isActive: 1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
        category: "$productCatlogRelation",
        imagesUrl: {
          $map: {
            input: "$imagesUrl.imageUrls",
            as: "imageUrl",
            in: {
              _id: { $arrayElemAt: ["$imagesUrl._id", 0] },
              imageUrl: { $concat: [process.env.IMGURL, "$$imageUrl"] }
            }
          }
        }
      }
    },

    {
      $sort: sortOptions
    },

    {
      $skip: skip
    },
    {
      $limit: limit
    }

  ])

  return productData;
}

export const findProduct = async (productdata) => {
  return await productModel.findOne(productdata);
}
export const updateProduct = async (query, updateData) => {
  return await productModel.findOneAndUpdate(query, updateData);
};

export const deleteProduct = async (productId) => {
  return await productModel.findOneAndDelete(productId);
}

export const paginationAggregation = async (productSearching) => {

  console.log(productSearching);
  const totalCnt = await productModel.aggregate([

    {
      $lookup: {
        from: "productcategoryrelations",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$productId", "$$productId"] }
            }
          },

          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "productCategories"
            }
          },

          {
            $project: {
              _id: { $arrayElemAt: ["$productCategories._id", 0] },
              categoryName: { $arrayElemAt: ["$productCategories.categoryName", 0] },

            }
          },

        ],
        as: "productCatlogRelation"
      }
    },

    { $match: productSearching },

    {
      $project: {
        _id: 1

      }
    }
  ]);

  const result = totalCnt.length;
  return result;
} 