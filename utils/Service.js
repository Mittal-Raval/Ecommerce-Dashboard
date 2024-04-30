import {NotFoundError} from "../error/error.js";

export const paginationAndSorting = async (pgAndSort) => {
  try {
    const { page = 1, perPage = 2, sortKey = '_id', sortOrder = 'desc' } = pgAndSort

    const sortOptions = {};
    sortOptions[sortKey] = sortOrder === 'desc' ? -1 : 1;

    const limit = perPage;
    const skip = (page - 1) * limit;
    const result = { sortOptions, skip, limit, page, perPage };
    return result;
  } catch (error) {
    throw new Error(error)
  }
};

export const searching = (searchFilter, fields) => {
  if (searchFilter) {
    const searchArray = fields.map((field) => ({
      [field]: { $regex: searchFilter, $options: "i" },
      // Spread the regex properties her
    }));
    return { $or: searchArray };
  }
  return {};
};

export const paginatedResponce = async (page, perPage, totalRecords, list) => {
  try {
    const totalPages = Math.ceil(totalRecords / perPage);
    if (page > totalPages) {
      throw new NotFoundError('Page not found');
    }
    let limit = perPage;
    return { list, page, limit, totalRecords, totalPages };
  } catch (error) {
    throw new Error(error)
  }
};

export const handleResponse = async (res, statusCode, message, data) => {
  try {
    if (statusCode >= 300) {
      return res.status(statusCode).json({ success: false, message });
    }

    if (!data) {
      return res.status(statusCode).json({ success: true, message });
    }

    return res.status(statusCode).json({ success: true, message, data });
  } catch (error) {
    throw new Error(error)
  }
};
