"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Building2,
  ImagePlus,
  LogOut,
  Plus,
  Save,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { Footer } from "../../components/site";
import {
  Property,
  PropertyInput,
  Service,
  createProperty,
  createService,
  deleteProperty,
  getAdminMessages,
  getAdminProperties,
  getDashboard,
  getServices,
  login,
  updateProperty,
  updateService,
  uploadPropertyImages,
} from "../../lib/api";

const emptyProperty: PropertyInput = {
  title: "",
  slug: "",
  description: "",
  price: 0,
  location: "",
  bedrooms: 0,
  bathrooms: 0,
  garage: 0,
  land_size: "",
  status: "draft",
  featured: false,
  property_type: "house",
};
const emptyService: Service = {
  id: 0,
  title: "",
  description: "",
  icon: "Building2",
};

type AdminMessage = {
  id: number | string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  created_at?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};
const toPropertyInput = (property: Property): PropertyInput => ({
  title: property.title,
  slug: property.slug,
  description: property.description,
  price: property.price,
  location: property.location,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  garage: property.garage,
  land_size: property.land_size,
  status: property.status,
  featured: property.featured,
  property_type: property.property_type,
});

// Key used to dedupe files picked across multiple file-input selections.
const fileKey = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}`;

// Turns a title into a URL-safe slug, matching the "[a-z0-9]+(-[a-z0-9]+)*" pattern
// the slug field validates against.
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem("admin_token"),
  );
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [property, setProperty] = useState<PropertyInput>(emptyProperty);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [service, setService] = useState<Service>(emptyService);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // Once the admin edits the slug field directly, stop overwriting it from the title.
  const [slugTouched, setSlugTouched] = useState(false);
  const client = useQueryClient();
  const dashboard = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => getDashboard(token!),
    enabled: !!token,
  });
  const messages = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () => getAdminMessages(token!) as Promise<AdminMessage[]>,
    enabled: !!token,
  });
  const properties = useQuery({
    queryKey: ["admin", "properties"],
    queryFn: () => getAdminProperties(token!),
    enabled: !!token,
  });
  const services = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    enabled: !!token,
  });
  const signIn = useMutation({
    mutationFn: () => login(credentials.username, credentials.password),
    onSuccess: ({ access_token }) => {
      localStorage.setItem("admin_token", access_token);
      setToken(access_token);
      setLoginError("");
    },
    onError: (error: Error) => setLoginError(error.message),
  });
  const saveProperty = useMutation({
    mutationFn: async () => {
      const saved = propertyId
        ? await updateProperty(token!, propertyId, property)
        : await createProperty(token!, property);
      if (files.length) await uploadPropertyImages(token!, saved.id, files);
      return saved;
    },
    onSuccess: () => {
      setNotice("Property saved successfully.");
      setProperty(emptyProperty);
      setPropertyId(null);
      setFiles([]);
      client.invalidateQueries({ queryKey: ["admin"] });
      client.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: Error) => setNotice(error.message),
  });
  const removeProperty = useMutation({
    mutationFn: (id: number) => deleteProperty(token!, id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: (_, id) => {
      setNotice("Property deleted.");
      if (propertyId === id) {
        setProperty(emptyProperty);
        setPropertyId(null);
        setFiles([]);
      }
      client.invalidateQueries({ queryKey: ["admin"] });
      client.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: Error) => setNotice(error.message),
    onSettled: () => setDeletingId(null),
  });
  const saveService = useMutation({
    mutationFn: () =>
      serviceId
        ? updateService(token!, serviceId, service)
        : createService(token!, service),
    onSuccess: () => {
      setNotice("Service saved successfully.");
      setService(emptyService);
      setServiceId(null);
      client.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: Error) => setNotice(error.message),
  });
  const signOut = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  // Object-URL previews for the currently selected (not-yet-uploaded) photos.
  const filePreviews = useMemo(
    () =>
      files.map((file) => ({
        key: fileKey(file),
        file,
        url: URL.createObjectURL(file),
      })),
    [files],
  );
  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [filePreviews]);

  const addFiles = (incoming: File[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map(fileKey));
      const additions = incoming.filter((file) => !existing.has(fileKey(file)));
      return [...prev, ...additions];
    });
  };
  const removeFile = (key: string) => {
    setFiles((prev) => prev.filter((file) => fileKey(file) !== key));
  };

  const handleDeleteProperty = (item: Property) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Delete "${item.title}"? This cannot be undone.`)
    ) {
      return;
    }
    removeProperty.mutate(item.id);
  };

  if (!token)
    return (
      <main className="admin-login">
        <section>
          <div className="admin-brand">
            SM <span>ADMIN</span>
          </div>
          <h1>Welcome back.</h1>
          <p>Sign in to manage properties and services.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              signIn.mutate();
            }}
          >
            <label>
              USERNAME
              <input
                required
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </label>
            <label>
              PASSWORD
              <input
                required
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </label>
            {loginError && <p className="admin-error">{loginError}</p>}
            <button className="button gold" disabled={signIn.isPending}>
              {signIn.isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    );
  const submitProperty = (event: FormEvent) => {
    event.preventDefault();
    setNotice("");
    saveProperty.mutate();
  };
  const submitService = (event: FormEvent) => {
    event.preventDefault();
    setNotice("");
    saveService.mutate();
  };
  return (
    <>
      <main className="admin-page">
        <header className="admin-header">
          <div className="admin-brand">
            SM <span>ADMIN</span>
          </div>
          <button onClick={signOut}>
            <LogOut size={16} /> Sign out
          </button>
        </header>
        <div className="admin-shell">
          <div className="admin-title">
            <div>
              <p>ADMIN DASHBOARD</p>
              <h1>Manage your business.</h1>
            </div>
            <button
              className="admin-new"
              onClick={() => {
                setProperty(emptyProperty);
                setPropertyId(null);
                setFiles([]);
                setSlugTouched(false);
              }}
            >
              <Plus size={17} /> New property
            </button>
          </div>
          {notice && <p className="admin-notice">{notice}</p>}

          <section className="admin-stats">
            <article>
              <Building2 />
              <strong>{dashboard.data?.total_properties ?? "—"}</strong>
              <span>Total properties</span>
            </article>
            <article>
              <BarChart3 />
              <strong>{dashboard.data?.featured_properties ?? "—"}</strong>
              <span>Featured listings</span>
            </article>
            <article>
              <Wrench />
              <strong>{dashboard.data?.messages ?? "—"}</strong>
              <span>New enquiries</span>
            </article>
          </section>
          <section className="admin-panel admin-panel-wide">
            <div className="panel-title">
              <h2>Enquiries</h2>
              <span>Messages submitted through the website contact form.</span>
            </div>
            <div className="admin-messages">
              {messages.isPending && <p>Loading messages…</p>}
              {!messages.isPending && messages.data?.length === 0 && (
                <p>No enquiries yet.</p>
              )}
              {messages.data?.map((item) => (
                <article key={item.id} className="admin-message">
                  <header>
                    <strong style={{ paddingRight: 5 }}>
                      {item.name || "Unknown sender"}
                    </strong>
                    {item.created_at && (
                      <time>{formatDate(item.created_at)}</time>
                    )}
                  </header>
                  <p className="admin-message-contact">
                    {item.email}
                    {item.phone ? ` · ${item.phone}` : ""}
                  </p>
                  {item.message && <p>{item.message}</p>}
                </article>
              ))}
            </div>
          </section>
          <div className="admin-grid">
            <section className="admin-panel">
              <div className="panel-title">
                <h2>{propertyId ? "Edit property" : "Add property"}</h2>
                <span>All fields marked by their label are required.</span>
              </div>
              <form className="admin-form" onSubmit={submitProperty}>
                <div className="admin-form-grid">
                  <label>
                    PROPERTY TITLE
                    <input
                      required
                      value={property.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setProperty((prev) => ({
                          ...prev,
                          title,
                          slug: slugTouched ? prev.slug : slugify(title),
                        }));
                      }}
                    />
                  </label>
                  <label>
                    SLUG
                    <input
                      required
                      pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                      value={property.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setProperty({ ...property, slug: e.target.value });
                      }}
                    />
                  </label>
                  <label>
                    PRICE (NGN)
                    <input
                      required
                      min="0"
                      type="number"
                      value={property.price}
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label>
                    LOCATION
                    <input
                      required
                      value={property.location}
                      onChange={(e) =>
                        setProperty({ ...property, location: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    TYPE
                    <select
                      value={property.property_type}
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          property_type: e.target.value,
                        })
                      }
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="land">Land</option>
                    </select>
                  </label>
                  <label>
                    STATUS
                    <select
                      value={property.status}
                      onChange={(e) =>
                        setProperty({ ...property, status: e.target.value })
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </label>
                  <label>
                    BEDROOMS
                    <input
                      min="0"
                      type="number"
                      value={property.bedrooms}
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          bedrooms: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label>
                    BATHROOMS
                    <input
                      min="0"
                      type="number"
                      value={property.bathrooms}
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          bathrooms: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label>
                    GARAGE
                    <input
                      min="0"
                      type="number"
                      value={property.garage}
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          garage: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label>
                    LAND SIZE
                    <input
                      value={property.land_size}
                      onChange={(e) =>
                        setProperty({ ...property, land_size: e.target.value })
                      }
                    />
                  </label>
                </div>
                <label>
                  DESCRIPTION
                  <textarea
                    required
                    value={property.description}
                    onChange={(e) =>
                      setProperty({ ...property, description: e.target.value })
                    }
                  />
                </label>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={property.featured}
                    onChange={(e) =>
                      setProperty({ ...property, featured: e.target.checked })
                    }
                  />{" "}
                  Feature this property on the homepage
                </label>
                <label className="admin-upload">
                  <ImagePlus size={18} /> Upload property photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      addFiles(Array.from(e.target.files ?? []));
                      // reset so picking the same file(s) again still fires onChange
                      e.target.value = "";
                    }}
                  />
                  <small>
                    {files.length
                      ? `${files.length} image(s) ready to upload — add more or remove below.`
                      : "Optional — select one or more images. You can add more in a second pass."}
                  </small>
                </label>
                {filePreviews.length > 0 && (
                  <div className="admin-image-previews">
                    {filePreviews.map((preview) => (
                      <div key={preview.key} className="admin-image-preview">
                        <img src={preview.url} alt={preview.file.name} />
                        <button
                          type="button"
                          className="admin-image-remove"
                          onClick={() => removeFile(preview.key)}
                          aria-label={`Remove ${preview.file.name}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="button gold"
                  disabled={saveProperty.isPending}
                >
                  <Save size={16} />{" "}
                  {saveProperty.isPending
                    ? "Saving…"
                    : propertyId
                      ? "Update property"
                      : "Create property"}
                </button>
              </form>
            </section>
            <section className="admin-panel">
              <div className="panel-title">
                <h2>Properties</h2>
                <span>Select a listing to update it.</span>
              </div>
              <div className="admin-list">
                {properties.isPending && <p>Loading properties…</p>}
                {properties.data?.map((item) => (
                  <div key={item.id} className="admin-row">
                    <button
                      type="button"
                      className="admin-row-main"
                      onClick={() => {
                        setProperty(toPropertyInput(item));
                        setPropertyId(item.id);
                        setFiles([]);
                        setSlugTouched(true);
                      }}
                    >
                      <span>
                        <strong>{item.title}</strong>
                        <small>
                          {item.location} · {item.status}
                        </small>
                      </span>
                      <b>Edit</b>
                    </button>
                    <button
                      type="button"
                      className="admin-row-delete"
                      onClick={() => handleDeleteProperty(item)}
                      disabled={
                        removeProperty.isPending && deletingId === item.id
                      }
                      title={`Delete ${item.title}`}
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            <section className="admin-panel">
              <div className="panel-title">
                <h2>{serviceId ? "Edit service" : "Add service"}</h2>
                <span>Services appear on the public website.</span>
              </div>
              <form className="admin-form" onSubmit={submitService}>
                <label>
                  SERVICE NAME
                  <input
                    required
                    value={service.title}
                    onChange={(e) =>
                      setService({ ...service, title: e.target.value })
                    }
                  />
                </label>
                <label>
                  ICON
                  <select
                    value={service.icon}
                    onChange={(e) =>
                      setService({ ...service, icon: e.target.value })
                    }
                  >
                    <option>Building2</option>
                    <option>Hammer</option>
                    <option>ShieldCheck</option>
                  </select>
                </label>
                <label>
                  DESCRIPTION
                  <textarea
                    required
                    value={service.description}
                    onChange={(e) =>
                      setService({ ...service, description: e.target.value })
                    }
                  />
                </label>
                <button
                  className="button gold"
                  disabled={saveService.isPending}
                >
                  <Save size={16} />{" "}
                  {saveService.isPending
                    ? "Saving…"
                    : serviceId
                      ? "Update service"
                      : "Create service"}
                </button>
              </form>
            </section>
            <section className="admin-panel">
              <div className="panel-title">
                <h2>Services</h2>
                <span>Choose a service to update it.</span>
              </div>
              <div className="admin-list">
                {services.data?.map((item) => (
                  <button
                    key={item.id}
                    className="admin-row"
                    onClick={() => {
                      setService(item);
                      setServiceId(item.id);
                    }}
                  >
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.icon}</small>
                    </span>
                    <b>Edit</b>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
