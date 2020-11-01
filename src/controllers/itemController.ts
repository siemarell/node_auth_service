import { RequestHandler } from "express";

export const handleSlackCallback: RequestHandler<null> = async (req, res, next) => {
  throw new Error("Not implemented");
  // const items = await Item.find({}).exec();
  // res.send(items);
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  throw new Error("Not implemented");
};

