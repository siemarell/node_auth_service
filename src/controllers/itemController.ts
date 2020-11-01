import { RequestHandler } from "express";
import { User } from "../models/Item";

export const getAllItems: RequestHandler<null> = async (req, res, next) => {
  throw new Error("Not implemented");
  // const items = await Item.find({}).exec();
  // res.send(items);
};
export const getItemById: RequestHandler = async (req, res, next) => {
  const item = await User.findById(req.params.id);
  res.send(item);
};

export const createItem: RequestHandler = async (req, res, next) => {
  const item = await User.create(req.body);
  res.send(item);
};
export const updateItem: RequestHandler = async (req, res, next) => {
  const item = await User.findByIdAndUpdate(req.params.id, req.body);
  res.send(item);
};
export const deleteItem: RequestHandler = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("OK");
};
