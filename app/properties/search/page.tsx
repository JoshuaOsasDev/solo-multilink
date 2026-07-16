"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Bath, BedDouble, MapPin, Ruler, SearchX, SlidersHorizontal } from "lucide-react";
import { Footer, Header, PageHero } from "../../../components/site";
import { formatNaira, propertyImage, searchProperties, type PropertySearch } from "../../../lib/api";

function PropertySearchContent() {
  const searchParams = useSearchParams();
  const filters: PropertySearch = {
    location: searchParams.get("location") || undefined,
    property_type: searchParams.get("property_type") || undefined,
    min_price: searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined,
    max_price: searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined,
  };
  const { data: properties = [], isPending, isError } = useQuery({ queryKey: ["property-search", filters], queryFn: () => searchProperties(filters) });
  const activeFilters = [filters.location, filters.property_type, filters.min_price || filters.max_price ? "Price range" : undefined].filter(Boolean);
  const stateStyle = { minHeight: 290, border: "1px dashed #cbdad2", background: "#f4f8f5", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", textAlign: "center" as const, gap: 10, padding: 32, color: "#62756d" };

  return <><Header/><PageHero label="Search properties" title={<>Your search,<br/><i>beautifully refined.</i></>}/><section className="page-section" style={{background:"#fbfcfb",minHeight:"56vh"}}><div className="shell"><Link href="/properties" className="text-link"><ArrowLeft size={17}/>Browse all properties</Link><div className="listing-head" style={{borderBottom:"1px solid #dae5df",paddingBottom:28,marginBottom:35}}><div><div className="eyebrow"><span/> SEARCH RESULTS</div><h2>{isPending ? "Finding properties…" : `${properties.length} ${properties.length === 1 ? "property" : "properties"} found`}</h2><p className="lead" style={{margin:0,fontSize:14}}>{activeFilters.length ? `Showing homes matching ${activeFilters.join(" · ")}.` : "Showing every available property in our collection."}</p></div><div style={{display:"flex",alignItems:"center",gap:8,background:"#e7f0eb",color:"#0b5a41",padding:"10px 13px",fontSize:12,fontWeight:700}}><SlidersHorizontal size={17}/>{activeFilters.length || "All"} filters</div></div>{isPending && <div style={stateStyle}><div style={{width:32,height:32,border:"3px solid #d5e5dd",borderTopColor:"#0b5a41",borderRadius:"50%"}}/><p>Searching our latest listings…</p></div>}{isError && <div style={stateStyle}><SearchX size={33}/><h3>We couldn&apos;t complete that search.</h3><p>Please check your connection and try again.</p><Link href="/properties" className="button gold">View all properties</Link></div>}{!isPending && !isError && (properties.length ? <div className="listing-grid">{properties.map((property) => <article className="listing-card" key={property.id}><img src={propertyImage(property)} alt={property.title}/><div className="copy"><span style={{color:"#0b5a41",fontSize:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{property.property_type}</span><h3 style={{marginTop:8}}>{property.title}</h3><p><MapPin size={14}/>{property.location}</p><div style={{display:"flex",gap:10,borderTop:"1px solid #e3eae6",paddingTop:12,margin:"15px 0",fontSize:10,color:"#6b7c74"}}><span><BedDouble size={15}/>{property.bedrooms} beds</span><span><Bath size={15}/>{property.bathrooms} baths</span><span><Ruler size={15}/>{property.land_size}</span></div><div className="bottom"><span>{formatNaira(property.price)}</span><Link href={`/properties/${property.slug}`}>View details <ArrowRight size={14}/></Link></div></div></article>)}</div> : <div style={stateStyle}><SearchX size={38}/><h3>No properties match those filters.</h3><p>Try broadening your search or explore the full collection.</p><Link href="/properties" className="button gold">Browse all properties <ArrowRight size={16}/></Link></div>)}</div></section><Footer/></>;
}

export default function PropertySearchPage() {
  return <Suspense fallback={<div className="page-section"><div className="shell"><p className="lead">Preparing your search…</p></div></div>}><PropertySearchContent /></Suspense>;
}
