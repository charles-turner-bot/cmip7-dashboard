import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchParquetSource,
  loadParquetDataSource,
  queryParquetSource,
  registerParquetSource,
} from "../dataSource";
import { closeDuckDB, initializeDuckDB } from "../duckdbClient";

vi.mock("../duckdbClient", () => ({
  initializeDuckDB: vi.fn(),
  closeDuckDB: vi.fn(),
}));

describe("dataSource", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches parquet bytes from a URL", async () => {
    const bytes = new Uint8Array([1, 2, 3]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(bytes.buffer),
      }),
    );

    await expect(
      fetchParquetSource("https://example.test/data.parquet"),
    ).resolves.toEqual(bytes);
  });

  it("throws when parquet fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    await expect(
      fetchParquetSource("https://example.test/missing.parquet"),
    ).rejects.toThrow("Failed to fetch parquet source: 404");
  });

  it("registers parquet bytes with DuckDB", async () => {
    const db = { registerFileBuffer: vi.fn() };
    const bytes = new Uint8Array([1, 2, 3]);

    await registerParquetSource(db as never, "source.parquet", bytes);

    expect(db.registerFileBuffer).toHaveBeenCalledWith("source.parquet", bytes);
  });

  it("queries a registered parquet source and normalizes vector values", async () => {
    const conn = {
      query: vi.fn().mockResolvedValue({
        toArray: () => [
          {
            model: "ACCESS-CM2",
            variables: { toArray: () => ["tas", "pr"] },
          },
        ],
      }),
    };

    const result = await queryParquetSource(
      conn as never,
      "source's.parquet",
      10,
    );

    expect(conn.query).toHaveBeenCalledWith(
      "SELECT * FROM read_parquet('source''s.parquet') LIMIT 10",
    );
    expect(result).toEqual({
      columns: ["model", "variables"],
      rows: [{ model: "ACCESS-CM2", variables: ["tas", "pr"] }],
    });
  });

  it("loads, registers, queries, and closes a parquet source", async () => {
    const bytes = new Uint8Array([1, 2, 3]);
    const db = { registerFileBuffer: vi.fn() };
    const conn = {
      query: vi.fn().mockResolvedValue({
        toArray: () => [{ experiment: "historical" }],
      }),
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(bytes.buffer),
      }),
    );
    vi.mocked(initializeDuckDB).mockResolvedValue({
      db,
      conn,
    } as never);

    const result = await loadParquetDataSource({
      url: "https://example.test/source.parquet",
      fileName: "cmip7.parquet",
      query: (fileName) => `SELECT experiment FROM read_parquet('${fileName}')`,
    });

    expect(db.registerFileBuffer).toHaveBeenCalledWith("cmip7.parquet", bytes);
    expect(conn.query).toHaveBeenCalledWith(
      "SELECT experiment FROM read_parquet('cmip7.parquet')",
    );
    expect(closeDuckDB).toHaveBeenCalledWith({ db, conn });
    expect(result.rows).toEqual([{ experiment: "historical" }]);
  });
});
