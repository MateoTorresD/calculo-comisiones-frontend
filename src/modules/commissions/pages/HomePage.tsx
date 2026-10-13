import { useEffect, useRef, useState } from "react";
import { calculateCommissions } from "../actions/calculate-commissions.action";
import { ApiError } from "../api/commissions.api";
import type { SellerCommission } from "../interfaces/seller-commission.interface";
import "./HomePage.css";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: SellerCommission[] };

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function HomePage() {
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-30");
  const [state, setState] = useState<State>({ status: "idle" });
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  async function calculate() {
    if (!startDate || !endDate) {
      setState({ status: "error", message: "Selecciona ambas fechas" });
      return;
    }
    if (startDate > endDate) {
      setState({
        status: "error",
        message: "La fecha de inicio no puede ser posterior a la fecha de fin",
      });
      return;
    }

    abortControllerRef.current?.abort();
    const currentController = new AbortController();
    abortControllerRef.current = currentController;
    setState({ status: "loading" });

    try {
      const data = await calculateCommissions(
        startDate,
        endDate,
        currentController.signal,
      );
      setState({ status: "success", data });
    } catch (error) {
      if (currentController.signal.aborted) return;
      setState({
        status: "error",
        message:
          error instanceof ApiError
            ? error.message
            : "Ocurrió un error inesperado",
      });
    }
  }

  const isLoading = state.status === "loading";

  return (
    <main>
      <h1>Gestión de Comisiones</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void calculate();
        }}
      >
        <label>
          Fecha de Inicio:
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
          />
        </label>
        <label>
          Fecha de Fin:
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Calculando…" : "Calcular comisión"}
        </button>
      </form>

      {isLoading && (
        <p className="notice" role="status">
          Cargando...
        </p>
      )}

      {state.status === "error" && (
        <p className="error" role="alert">
          {state.message}
        </p>
      )}

      {state.status === "success" &&
        (state.data.length === 0 ? (
          <p className="notice">No hay vendedores registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Total Ventas</th>
                  <th>Porcentaje Comisión</th>
                  <th>Comisión</th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((row) => (
                  <tr key={row.sellerId}>
                    <td>{row.sellerName}</td>
                    <td>{currencyFormatter.format(row.totalSales)}</td>
                    <td>{row.commissionPercentage.toFixed(2)}%</td>
                    <td className="commission">
                      {currencyFormatter.format(row.commission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </main>
  );
}
