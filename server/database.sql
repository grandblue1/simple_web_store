--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2023-09-15 21:53:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16413)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    cost numeric(10,2) NOT NULL,
    image_url character varying(1000000),
    description text
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16412)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 216
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 220 (class 1259 OID 16438)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(0) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16422)
-- Name: user_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_cart (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer NOT NULL
);


ALTER TABLE public.user_cart OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16421)
-- Name: user_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_cart_id_seq OWNER TO postgres;

--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_cart_id_seq OWNED BY public.user_cart.id;


--
-- TOC entry 215 (class 1259 OID 16402)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16401)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3188 (class 2604 OID 16416)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 16425)
-- Name: user_cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_cart ALTER COLUMN id SET DEFAULT nextval('public.user_cart_id_seq'::regclass);


--
-- TOC entry 3187 (class 2604 OID 16405)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3347 (class 0 OID 16413)
-- Dependencies: 217
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, cost, image_url, description) FROM stdin;
1	Half Running Set	750.00	https://i.imgur.com/B5zL4b3.png	The matching top complements the shorts in style and functionality, often designed with similar moisture-wicking properties and a comfortable fit.
2	Formal Men Lowers	1200.00	https://i.imgur.com/K4S7rXq.png	Formal Men Lowers typically refer to dress trousers or pants designed for formal occasions.
3	Half Running Suit	996.70	https://i.imgur.com/Qfd7oKx.png	A Half Running Suit is a sportswear ensemble designed for active individuals.
4	Half Fancy Lady Dress	2100.00	https://i.imgur.com/EtaIBBk.jpg	A Half Fancy Lady Dress is an elegant and sophisticated garment designed for formal or semi-formal occasions.
5	Flix Flox Jeans	1260.00	https://i.imgur.com/oj7eQNX.jpg	Flix Flox Jeans are a trendy and contemporary denim option known for their distinctive design.
6	Fancy Salwar Suits	1160.00	https://i.imgur.com/u0sHWiA.jpg	These suits are crafted from luxurious fabrics like silk, chiffon, or georgette, and are often adorned with ornate embroidery, sequins, beads, or other embellishments.
7	Printed Straight Kurta	880.00	https://i.imgur.com/aEOmnXH.jpg	This knee-length tunic features a straight cut and is adorned with various printed patterns, which can range from intricate floral motifs to geometric designs.
8	Collot Full Dress	1653.00	https://i.imgur.com/1QIEZK6.jpg	A Collot Full Dress is a formal ensemble, typically worn by men for special occasions.
\.


--
-- TOC entry 3350 (class 0 OID 16438)
-- Dependencies: 220
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (sid, sess, expire) FROM stdin;
5761b17f-70a7-4eb0-9b67-1232451b3efb	{"cookie":{"originalMaxAge":604800,"expires":"2023-09-13T14:42:45.168Z","secure":false,"httpOnly":true,"path":"/"},"userID":2}	2023-09-13 17:45:10
62bf56ad-ba95-441e-8be6-84c63eb0d2f1	{"cookie":{"originalMaxAge":604800,"expires":"2023-09-13T12:08:07.296Z","secure":false,"httpOnly":true,"path":"/"},"userID":2}	2023-09-13 15:17:05
a894134c-b74e-4750-b480-0a13dd671644	{"cookie":{"originalMaxAge":604800,"expires":"2023-09-13T17:42:03.556Z","secure":false,"httpOnly":true,"path":"/"},"userID":2}	2023-09-13 20:43:27
64a5ffc9-9093-4d87-8c41-776bde1dfc7c	{"cookie":{"originalMaxAge":604800,"expires":"2023-09-13T14:36:59.325Z","secure":false,"httpOnly":true,"path":"/"},"userID":2}	2023-09-13 17:41:50
50b9060e-c6f5-479c-8008-48853a8d969f	{"cookie":{"originalMaxAge":604800,"expires":"2023-09-15T08:57:39.720Z","secure":false,"httpOnly":true,"path":"/"},"userID":2}	2023-09-15 11:58:32
\.


--
-- TOC entry 3349 (class 0 OID 16422)
-- Dependencies: 219
-- Data for Name: user_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_cart (id, user_id, product_id, quantity) FROM stdin;
\.


--
-- TOC entry 3345 (class 0 OID 16402)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password) FROM stdin;
1	asad@das.c	dasds
2	admin@a.a	admin
\.


--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 216
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 9, false);


--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_cart_id_seq', 82, true);


--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 3195 (class 2606 OID 16420)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3199 (class 2606 OID 16444)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- TOC entry 3197 (class 2606 OID 16427)
-- Name: user_cart user_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_cart
    ADD CONSTRAINT user_cart_pkey PRIMARY KEY (id);


--
-- TOC entry 3191 (class 2606 OID 16411)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3193 (class 2606 OID 16409)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 16433)
-- Name: user_cart user_cart_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_cart
    ADD CONSTRAINT user_cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3201 (class 2606 OID 16428)
-- Name: user_cart user_cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_cart
    ADD CONSTRAINT user_cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2023-09-15 21:53:56

--
-- PostgreSQL database dump complete
--

