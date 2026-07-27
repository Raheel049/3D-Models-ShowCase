import ProductVariant from "../../models/product/productHotspot.js";
import * as hotspotService from "../../services/productHotspot.service.js";

import {
  createHotspotSchema,
  updateHotspotSchema,
} from "../../validation/productHotspot.validation.js";

export const createHotspot = async (req, res) => {
  try {

    const { error } =
      createHotspotSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const variant =
      await ProductVariant.findById(req.body.variant);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    const hotspot =
      await hotspotService.createHotspot({
        ...req.body,
        createdBy: req.user.id,
      });

    return res.status(201).json({
      success: true,
      data: hotspot,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const getHotspots = async (req, res) => {

  try {

    const variant =
      await ProductVariant.findById(
        req.params.variantId
      );

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    const hotspots =
      await hotspotService.getHotspots(
        req.params.variantId
      );

    return res.status(200).json({
      success: true,
      data: hotspots,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


export const getHotspot = async (req, res) => {

  try {

    const hotspot =
      await hotspotService.getHotspotById(
        req.params.id
      );

    if (!hotspot) {
      return res.status(404).json({
        success: false,
        message: "Hotspot not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: hotspot,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


export const updateHotspot = async (req, res) => {

  try {

    const { error } =
      updateHotspotSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const hotspot =
      await hotspotService.getHotspotById(
        req.params.id
      );

    if (!hotspot) {
      return res.status(404).json({
        success: false,
        message: "Hotspot not found",
      });
    }

    const updated =
      await hotspotService.updateHotspot(
        req.params.id,
        {
          ...req.body,
          updatedBy: req.user.id,
        }
      );

    return res.status(200).json({
      success: true,
      data: updated,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


export const deleteHotspot = async (req, res) => {

  try {

    const hotspot =
      await hotspotService.getHotspotById(
        req.params.id
      );

    if (!hotspot) {
      return res.status(404).json({
        success: false,
        message: "Hotspot not found",
      });
    }

    await hotspotService.deleteHotspot(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Hotspot deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


export const reorderHotspots = async (req, res) => {

  try {

    const { hotspots } = req.body;

    await hotspotService.reorderHotspots(
      hotspots
    );

    return res.status(200).json({
      success: true,
      message: "Hotspots reordered successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};