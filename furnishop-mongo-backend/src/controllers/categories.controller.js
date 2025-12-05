const mongoose = require("mongoose");
const Category = require("../models/Category");
const slugify = (s) => String(s||"").toLowerCase().trim().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");

exports.create = async (req, res) => {
  try {
    const { name, slug, parent=null, order=0, isActive=true, image="", metaTitle="", metaDescription="" } = req.body;
    if (!name) return res.status(400).json({ message: "Thiếu tên danh mục" });

    const _slug = slug ? slugify(slug) : slugify(name);
    const existed = await Category.findOne({ slug: _slug });
    if (existed) return res.status(409).json({ message: "Slug đã tồn tại" });

    let parentId = parent;
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) parentId = null;

    const doc = await Category.create({
      name, slug: _slug, parent: parentId,
      order: Number(order)||0, isActive: !!isActive,
      image, metaTitle, metaDescription
    });
    res.status(201).json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = { ...req.body };

    if (patch.slug) patch.slug = slugify(patch.slug);
    if (patch.name && !patch.slug) patch.slug = slugify(patch.name);
    if (patch.slug) {
      const existed = await Category.findOne({ slug: patch.slug, _id: { $ne: id } });
      if (existed) return res.status(409).json({ message: "Slug đã được dùng" });
    }
    if (patch.order != null) patch.order = Number(patch.order)||0;
    if (patch.parent && !mongoose.Types.ObjectId.isValid(patch.parent)) patch.parent = null;

    const doc = await Category.findByIdAndUpdate(id, patch, { new: true });
    if (!doc) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const ok = await Category.findByIdAndDelete(req.params.id);
    if (!ok) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || req.params.slug;
    let doc = null;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) doc = await Category.findById(idOrSlug);
    if (!doc) doc = await Category.findOne({ slug: idOrSlug });
    if (!doc) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.list = async (req, res) => {
  try {
    const { q, active, parent=null, sort="order name", page=1, limit=200 } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (active != null) filter.isActive = active === "true";
    if (parent === "root") filter.parent = null;
    else if (parent) filter.parent = parent;

    const pg = Math.max(1, Number(page));
    const lim = Math.max(1, Math.min(500, Number(limit)));
    const skip = (pg - 1) * lim;

    const [items, total] = await Promise.all([
      Category.find(filter).sort(String(sort)).skip(skip).limit(lim),
      Category.countDocuments(filter)
    ]);
    res.json({ items, total, page: pg, pages: Math.ceil(total/lim) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.count = async (_req, res) => {
  try {
    const total = await Category.estimatedDocumentCount();
    res.json({ total });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
