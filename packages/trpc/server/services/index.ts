import UserService from "@repo/services/user";
import FormService from "@repo/services/form";
import ResponseService from "@repo/services/response";
import FileService from "@repo/services/files";

export const userService = new UserService();
export const formService = new FormService();
export const responseService = new ResponseService();
export const fileService = new FileService();