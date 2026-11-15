import { authActions } from "./auth";
import { commentsActions } from "./comments";
import { likesActions } from "./likes";
import { profileActions } from "./profile";
import { feedsActions } from "./feeds";

export const server = {
	...authActions,
	...commentsActions,
	...likesActions,
	...profileActions,
	...feedsActions,
};
