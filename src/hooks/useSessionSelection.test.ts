import { renderHook, act } from "@testing-library/react";
import { useSessionSelection } from "./useSessionSelection";

const KEY = "test:cart";

beforeEach(() => {
  window.sessionStorage.clear();
});

describe("useSessionSelection", () => {
  it("hydrates from sessionStorage on mount", () => {
    window.sessionStorage.setItem(KEY, JSON.stringify(["b1", "b3"]));

    const { result } = renderHook(() => useSessionSelection(KEY));

    expect(result.current.count).toBe(2);
    expect(result.current.isSelected("b1")).toBe(true);
    expect(result.current.isSelected("b3")).toBe(true);
    expect(result.current.isSelected("b2")).toBe(false);
  });

  it("toggle persists to sessionStorage", () => {
    window.sessionStorage.setItem(KEY, JSON.stringify(["b1"]));

    const { result } = renderHook(() => useSessionSelection(KEY));

    act(() => {
      result.current.toggle("b2");
    });

    expect(result.current.count).toBe(2);
    expect(result.current.isSelected("b2")).toBe(true);

    const stored = JSON.parse(window.sessionStorage.getItem(KEY) ?? "[]");
    expect(stored).toContain("b1");
    expect(stored).toContain("b2");
  });

  it("remove deletes a single id", () => {
    window.sessionStorage.setItem(KEY, JSON.stringify(["b1", "b2", "b3"]));

    const { result } = renderHook(() => useSessionSelection(KEY));

    act(() => {
      result.current.remove("b2");
    });

    expect(result.current.count).toBe(2);
    expect(result.current.isSelected("b2")).toBe(false);
    expect(result.current.isSelected("b1")).toBe(true);
    expect(result.current.isSelected("b3")).toBe(true);
  });

  it("clear empties the set and storage", () => {
    window.sessionStorage.setItem(KEY, JSON.stringify(["b1", "b2", "b3"]));

    const { result } = renderHook(() => useSessionSelection(KEY));
    expect(result.current.count).toBe(3);

    act(() => {
      result.current.clear();
    });

    expect(result.current.count).toBe(0);
    const stored = window.sessionStorage.getItem(KEY);
    expect(JSON.parse(stored ?? "[]")).toEqual([]);
  });

  it("falls back to in-memory when sessionStorage.setItem throws", () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceeded", "QuotaExceededError");
      });

    const { result } = renderHook(() => useSessionSelection(KEY));

    act(() => {
      result.current.toggle("b1");
    });

    expect(result.current.count).toBe(1);
    expect(result.current.isSelected("b1")).toBe(true);

    setItemSpy.mockRestore();
  });
});
