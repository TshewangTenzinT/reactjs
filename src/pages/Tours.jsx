import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import TOURS, { CATEGORIES, DESTINATIONS } from "../data/tours";
import TourCard from "../components/TourCard";

export default function Tours() {
  const [params, setParams] = useSearchParams();
  const destination = params.get("destination") || "";
  const category = params.get("category") || "";
  const maxPrice = Number(params.get("maxPrice")) || 0;
  const guests = Number(params.get("guests")) || 0;
  const sort = params.get("sort") || "popular";
  const q = params.get("q") || "";

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    let list = TOURS.filter(
      (t) =>
        (!destination || t.destination === destination) &&
        (!category || t.category === category) &&
        (!maxPrice || t.price <= maxPrice) &&
        (!guests || t.maxGroup >= guests) &&
        (!q || (t.title + t.summary + t.destination).toLowerCase().includes(q.toLowerCase()))
    );
    const sorters = {
      popular: (a, b) => b.rating - a.rating,
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      duration: (a, b) => a.days - b.days,
    };
    return [...list].sort(sorters[sort] || sorters.popular);
  }, [destination, category, maxPrice, guests, sort, q]);

  return (
    <section className="container section">
      <h1>Tours & packages</h1>
      <div className="filters">
        <input placeholder="Search tours…" value={q} onChange={(e) => set("q", e.target.value)} />
        <select value={destination} onChange={(e) => set("destination", e.target.value)}>
          <option value="">All destinations</option>
          {DESTINATIONS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={category} onChange={(e) => set("category", e.target.value)}>
          <option value="">All styles</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={maxPrice || ""} onChange={(e) => set("maxPrice", e.target.value)}>
          <option value="">Any budget</option>
          <option value="1000">Under $1,000</option>
          <option value="1500">Under $1,500</option>
          <option value="2000">Under $2,000</option>
        </select>
        <select value={sort} onChange={(e) => set("sort", e.target.value)}>
          <option value="popular">Top rated</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
          <option value="duration">Shortest first</option>
        </select>
      </div>
      <p className="muted">{results.length} tour{results.length === 1 ? "" : "s"} found</p>
      {results.length ? (
        <div className="grid">
          {results.map((t) => <TourCard key={t.id} tour={t} />)}
        </div>
      ) : (
        <div className="empty">
          No tours match those filters. <button className="link" onClick={() => setParams({})}>Clear filters</button>
        </div>
      )}
    </section>
  );
}
