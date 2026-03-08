const Ngo = require('../models/Ngo');

const createNgo = async (req, res, next) => {
  try {
    const ngo = await Ngo.create(req.body);
    return res.status(201).json({ success: true, data: ngo });
  } catch (error) {
    return next(error);
  }
};

const getNgos = async (req, res, next) => {
  try {
    const { kitchenId } = req.query;
    const filter = kitchenId ? { kitchenId } : {};
    const ngos = await Ngo.find(filter).sort({ name: 1 });
    return res.status(200).json({ success: true, data: ngos });
  } catch (error) {
    return next(error);
  }
};

const getNearbyNgos = async (req, res, next) => {
  try {
    const {
      lat,
      lng,
      radiusKm = 10,
      kitchenId
    } = req.query;

    const pipeline = [];

    const matchStage = {};
    if (kitchenId) {
      matchStage.kitchenId = kitchenId;
    }

    pipeline.push({
      $geoNear: {
        near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        distanceField: 'distanceKm',
        distanceMultiplier: 1 / 1000,
        spherical: true,
        query: matchStage
      }
    });

    pipeline.push({ $limit: 100 });

    const ngos = await Ngo.aggregate(pipeline);

    const formatted = ngos.map((ngo) => {
      // Keep the same field structure as the original Ngo schema by spreading
      return {
        ...ngo,
        distanceKm: Number(ngo.distanceKm.toFixed(2))
      };
    });

    const withinRadius = formatted.filter(
      (ngo) => ngo.distanceKm <= Number(radiusKm)
    );

    return res.status(200).json({
      success: true,
      data: {
        source: { lat: Number(lat), lng: Number(lng), radiusKm: Number(radiusKm) },
        count: withinRadius.length,
        ngos: withinRadius,
        allSorted: formatted
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNgo,
  getNgos,
  getNearbyNgos
};
