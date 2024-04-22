import { DeviceModel } from "../models/device";
import { UserModel } from "../models/user";

/**
 * Attempts to query a given user based on device
 * @param deviceCode
 */
export async function getUserFromDevice(deviceCode: string) {
  const device = await DeviceModel.findOne({
    code: deviceCode,
  });

  if (!device || !device.connectedUser) {
    return null;
  }

  return await UserModel.findById(device.connectedUser);
}
