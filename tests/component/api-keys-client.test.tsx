import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiKeysClient } from "@/app/(dashboard)/dashboard/admin/api-keys/api-keys-client";
import { toast } from "sonner";

const translations: Record<string, string> = {
  title: "API Keys",
  description: "Create and manage API keys for programmatic access.",
  createKey: "Create API Key",
  noKeys: "No API keys yet.",
  colName: "Name",
  colKey: "API Key",
  colRole: "Role",
  colCreatedBy: "Created By",
  colLastUsed: "Last Used",
  colExpires: "Expires",
  colStatus: "Status",
  colActions: "Actions",
  active: "Active",
  inactive: "Inactive",
  expired: "Expired",
  never: "Never",
  noExpiry: "No expiry",
  createTitle: "Create API Key",
  createDescription: "The key will only be shown once after creation.",
  nameLabel: "Name",
  namePlaceholder: "e.g. CI/CD Pipeline",
  roleLabel: "Role",
  expiryLabel: "Expiry",
  expiryNone: "No expiry",
  expiry30d: "30 days",
  expiry90d: "90 days",
  expiry1y: "1 year",
  create: "Create",
  cancel: "Cancel",
  createSuccess: "API key created",
  createError: "Failed to create API key",
  keyCreatedTitle: "API Key Created",
  keyCreatedDescription: "Copy this key now. It will not be shown again.",
  copyKey: "Copy Key",
  copyMaskedKeyPreview: "Copy masked key preview",
  copied: "Copied!",
  maskedKeyPreviewCopied: "Masked key preview copied",
  done: "Done",
  roleOptionSuperAdmin: "Super Admin",
  roleOptionAdmin: "Admin",
  roleOptionInstructor: "Instructor",
  roleOptionAssistant: "Assistant",
  roleOptionStudent: "Student",
  deactivateSuccess: "API key deactivated",
  activateSuccess: "API key activated",
  deleteConfirmTitle: "Delete API Key?",
  deleteConfirmDescription: "delete",
  delete: "Delete",
  deleteSuccess: "API key deleted",
  deleteFailed: "Failed to delete API key",
  toggleFailed: "Failed to update API key",
};

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => translations[key] ?? key,
  useLocale: () => "en",
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ApiKeysClient", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn(() => true),
    });
  });

  it("renders only masked previews for stored keys and reveals raw key once after creation", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: "key-1",
              name: "Deploy Key",
              keyPrefix: "jk_test_",
              role: "admin",
              createdById: "admin-id",
              createdByName: "Admin User",
              lastUsedAt: null,
              expiresAt: null,
              isActive: true,
              createdAt: "2026-04-04T00:00:00.000Z",
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            id: "key-2",
            name: "CI Key",
            keyPrefix: "jk_ci_12",
            key: "jk_ci_secret_key_123456",
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: "key-1",
              name: "Deploy Key",
              keyPrefix: "jk_test_",
              role: "admin",
              createdById: "admin-id",
              createdByName: "Admin User",
              lastUsedAt: null,
              expiresAt: null,
              isActive: true,
              createdAt: "2026-04-04T00:00:00.000Z",
            },
            {
              id: "key-2",
              name: "CI Key",
              keyPrefix: "jk_ci_12",
              role: "admin",
              createdById: "admin-id",
              createdByName: "Admin User",
              lastUsedAt: null,
              expiresAt: null,
              isActive: true,
              createdAt: "2026-04-04T00:00:00.000Z",
            },
          ],
        }),
      });

    render(<ApiKeysClient />);

    expect(await screen.findByText("Deploy Key")).toBeInTheDocument();
    expect(screen.getByText("jk_test_••••••••••••")).toBeInTheDocument();
    expect(screen.queryByText("jk_ci_secret_key_123456")).not.toBeInTheDocument();

    const user = userEvent.setup();
    const clipboardWriteTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: "Create API Key" }));
    await user.type(screen.getByPlaceholderText("e.g. CI/CD Pipeline"), "CI Key");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("API Key Created")).toBeInTheDocument();
    expect(screen.getByText("jk_ci_secret_key_123456")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy Key" }));

    await waitFor(() => {
      expect(clipboardWriteTextSpy).toHaveBeenCalledWith("jk_ci_secret_key_123456");
      expect(toast.success).toHaveBeenCalledWith("Copied!");
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });
  });

  it("copies the masked key preview from the table without presenting it as the full key", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "key-1",
            name: "Deploy Key",
            keyPrefix: "jk_test_",
            role: "admin",
            createdById: "admin-id",
            createdByName: "Admin User",
            lastUsedAt: null,
            expiresAt: null,
            isActive: true,
            createdAt: "2026-04-04T00:00:00.000Z",
          },
        ],
      }),
    });
    render(<ApiKeysClient />);

    expect(await screen.findByText("Deploy Key")).toBeInTheDocument();

    const user = userEvent.setup();
    const clipboardWriteTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    const row = screen.getByText("Deploy Key").closest("tr");
    expect(row).not.toBeNull();
    const rowScope = within(row as HTMLTableRowElement);
    expect(rowScope.queryByRole("button", { name: "Copy Key" })).not.toBeInTheDocument();
    await user.click(
      rowScope.getByRole("button", { name: /copyMaskedKeyPreview|Copy masked key preview/i })
    );

    await waitFor(() => {
      expect(clipboardWriteTextSpy).toHaveBeenCalledWith("jk_test_••••••••••••");
      expect(toast.success).toHaveBeenCalledWith("Masked key preview copied");
    });
  });

  it("renders manageable custom role options in the create dialog", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(
      <ApiKeysClient
        roleOptions={[
          { name: "admin", displayName: "Admin", level: 3 },
          { name: "custom_reviewer", displayName: "Custom Reviewer", level: 2 },
        ]}
      />
    );

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Create API Key" }));
    const dialog = await screen.findByRole("dialog");
    const roleCombobox = within(dialog).getAllByRole("combobox")[0];
    await user.click(roleCombobox);

    expect(await screen.findByText("Custom Reviewer")).toBeInTheDocument();
  });
});
