import { describe, expect, it, vi } from "vitest";

vi.mock("../db/client", () => ({ client: {} }));

import { serializeComment } from "./comment-data";

const user = {
	id: "author",
	name: "Author",
	email: "author@example.com",
	image: null,
	emailVerified: true,
	createdAt: new Date(0),
	updatedAt: new Date(0),
};
const row: Parameters<typeof serializeComment>[0] = {
	id: "reply",
	refTable: "updates",
	refId: "post",
	userId: user.id,
	content: "A reply",
	status: "published",
	parentId: "root",
	rootId: "root",
	createdAt: 1,
	updatedAt: 2,
	user,
	parent: {
		id: "root",
		refTable: "updates",
		refId: "post",
		userId: user.id,
		content: "Original comment",
		status: "published",
		parentId: null,
		rootId: null,
		createdAt: 0,
		updatedAt: 0,
		user,
	},
};

describe("comment records", () => {
	it("redacts both authors and serializes database seconds without leaking private fields", () => {
		const result = serializeComment(row);
		expect(result.createdAt).toBe("1970-01-01T00:00:01.000Z");
		expect(result.updatedAt).toBe("1970-01-01T00:00:02.000Z");
		expect(result.user).toEqual({
			id: "author",
			name: "Author",
			email: "a*****@*******.com",
			image: null,
		});
		expect(result.parent).toEqual({
			id: "root",
			content: "Original comment",
			createdAt: "1970-01-01T00:00:00.000Z",
			user: result.user,
		});
	});
	it("preserves root comments without a parent", () => {
		expect(
			serializeComment({ ...row, parentId: null, rootId: null, parent: null }).parent,
		).toBeNull();
	});
	it("preserves a parent whose author is unavailable", () => {
		const result = serializeComment({ ...row, parent: { ...row.parent!, user: null } });
		expect(result.parent?.id).toBe("root");
		expect(result.parent?.user).toBeNull();
	});
});
