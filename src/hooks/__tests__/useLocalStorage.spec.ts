import { renderHook, act } from '@testing-library/react-hooks';
import useLocalStorage from '../useLocalStorage';

describe('useLocalStorage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should return initial value if local storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    expect(result.current[0]).toBe(0);
  });

  it('should return value from local storage if present', () => {
    localStorage.setItem('count', '5');

    const { result } = renderHook(() => useLocalStorage('count', 0));

    expect(result.current[0]).toBe(5);
  });

  it('should update value in local storage', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1](10);
    });

    expect(result.current[0]).toBe(10);
    expect(localStorage.getItem('count')).toBe('10');
  });
});
