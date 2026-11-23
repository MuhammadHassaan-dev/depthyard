# Depthyard — architecture and page plan

Published name: **Depthyard**. The domain is depthyard.com. This document is the build spec for a static material-quantity site. It sits beside Basefigure and does not share a domain with it.

The visitor types a size and gets a quantity: cubic yards, bags, tons, or gallons. The page does not show a price, a supplier, or a city. Prices go stale, and a city URL that repeats one national formula is a doorway page.

Other names that were still clear when this file was written: Fieldlot, Depthlot, Bagspan, Pourfield. Do not use YardPour, MixYard, Lotspan, Construct Math, or ConcreteCalculus. Those names are already in use.

## Product

Four materials, one site.

| Material | What the visitor gets | What they type |
|---|---|---|
| Concrete | Cubic yards, cubic feet, and whole bags | Length, width, thickness, waste, bag size |
| Gravel | Cubic yards and tons | Length, width, depth, waste, pounds per cubic yard |
| Mulch | Cubic yards and whole bags | Length, width, depth, waste, bag size in cubic feet |
| Paint | Gallons and quarts | Wall length, wall height, number of walls, coats, square feet per gallon, openings |

Waste, bag yield, gravel density, and paint coverage are visible inputs. Each has a labeled default. The visitor can change the default. The page never hides a 10% waste factor inside the formula.

Out of scope for the first release: prices, city or ZIP pages, rebar schedules, block and mortar counts, post-hole displacement, stairs, round slabs, driveways as a separate shape, and accounts. Those can be later pages only when each one has its own inputs and its own copy.

## Architecture

Next.js App Router, TypeScript, Tailwind CSS. Every public URL is generated at build time from a content record. The HTML already contains the heading, the introduction, the formula, the worked example, and the FAQ. The only client-side code is the form that recomputes the quantity as the visitor types.

No database, no Redis, no separate API, and no request-time call to a supplier. A dead third-party service must not be able to blank a result.

```
app/
  layout.tsx                         Site shell, header, footer, theme
  page.tsx                           Home
  robots.ts
  sitemap.ts
  concrete-calculator/page.tsx
  concrete-slab-calculator/page.tsx
  concrete-pad-calculator/page.tsx
  concrete-bag-calculator/page.tsx
  gravel-calculator/page.tsx
  mulch-calculator/page.tsx
  paint-calculator/page.tsx
  about/page.tsx
  privacy/page.tsx
  terms/page.tsx
  contact/page.tsx

components/
  layout/SiteHeader.tsx
  layout/SiteFooter.tsx
  layout/Breadcrumbs.tsx
  layout/ThemeToggle.tsx
  layout/AdSlot.tsx
  content/PageHero.tsx
  content/QuantityPage.tsx
  content/FormulaBlock.tsx
  content/WorkedExample.tsx
  content/FaqList.tsx
  content/RelatedLinks.tsx
  content/DefaultNote.tsx
  content/JsonLd.tsx
  calculator/NumberField.tsx
  calculator/DimensionField.tsx
  calculator/SelectField.tsx
  calculator/SegmentedControl.tsx
  calculator/ResultStat.tsx
  calculator/ResultStage.tsx
  calculator/VolumeTool.tsx
  calculator/PaintTool.tsx

content/
  pages.ts                           Shared types and the seven page records
  concrete.ts                        Copy for the four concrete URLs
  gravel.ts
  mulch.ts
  paint.ts

data/
  defaults.ts                        Bag yields, density, coverage, sources

lib/
  format.ts                          Yards, feet, tons, bags, gallons
  seo.ts                             Title, description, canonical, JSON-LD
  site.ts                            Site name, URL, contact
  calculators/volume.ts              Shared geometry
  calculators/concrete.ts
  calculators/aggregate.ts           Gravel and mulch
  calculators/paint.ts
  calculators/units.ts               Feet, inches, meters, centimeters

tests/
  volume.test.ts
  concrete.test.ts
  aggregate.test.ts
  paint.test.ts
```

Concrete, gravel, mulch, and paint are real routes because each query needs its own title, example, and FAQ. Slab, pad, and bags are also real routes. They share `VolumeTool` and `concreteQuantity`. They do not share a paragraph of body copy. Swapping the word "slab" for "pad" inside one essay is not a second page.

### Why the HTML is static

Search is the distribution. Each URL answers one query: a unique title, one H1, a short introduction, the tool, the formula, one worked example, and a few FAQs. That copy is rendered on the server. The tool is a client island under the introduction. If JavaScript fails, the explanation and the example are still there.

### Performance

- The result is computed in the browser from the numbers the visitor typed. Nothing is posted to a server.
- Pages are static. `dynamicParams` is false. There is no per-request data fetch.
- Fonts load through `next/font` with a fallback, so text does not jump.
- The first screen has no photograph and no third-party script except the AdSense tag, and that tag stays empty until `NEXT_PUBLIC_ADSENSE_CLIENT` is set.
- The ad slot below the tool reserves its height so the result does not move when an ad arrives.
- Inputs are at least 48px tall. The result is the largest text on the page.

## Defaults file

`data/defaults.ts` holds the starting values and the place they were read. The calculator copies them into the form. Changing a default is a data edit and a rebuild. It is not a runtime lookup.

Check every yield against the bag or the coverage label before the first deploy, and set `lastVerified`. Do not copy a yield from another calculator site.

```ts
type DefaultValue = {
  id: string;              // "concrete-bag-80"
  label: string;           // "80 lb bag"
  value: number;           // 0.6
  unit: string;            // "cu ft"
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;    // ISO date
  note: string;            // "Yield is printed on the bag. This is a starting value."
};
```

Starting set, to be confirmed against the printed label:

| Default | Starting value | Why it is editable |
|---|---|---|
| 80 lb concrete bag | 0.60 cu ft | Brands differ by a few hundredths |
| 60 lb concrete bag | 0.45 cu ft | Same reason |
| 40 lb concrete bag | 0.30 cu ft | Same reason |
| Waste | 10% | The visitor's subgrade, not a law |
| Gravel density | 1.4 ton per cu yd | Wet and dry gravel differ |
| Mulch bag | 2 cu ft | Bags are also sold as 1.5 and 3 cu ft |
| Paint coverage | 350 sq ft per gallon | The can prints the real number |
| Coats | 2 | One coat is a real job |

The result line names the default it used: "80 lb bags at 0.60 cu ft each." If the visitor changes it, the line names their number instead.

## Formulas

Pure functions in `lib/calculators`. Unit tests cover them. Convert every input to a base unit first, then do the geometry, then round the display. Do not round inside the geometry.

### Units

`units.ts` converts before any formula runs.

- Feet and inches become decimal feet: `feet + inches / 12`.
- Meters and centimeters become meters.
- Thickness in inches becomes feet by dividing by 12. A 4 inch slab is 4/12 foot, not 4 feet.
- The form shows the unit on the field. It does not assume the visitor knows to divide by 12.

A segmented control switches the whole tool between US and metric. The formula is the same. Only the conversion at the edge changes.

### Volume

`volume.ts` returns cubic feet for a US job and cubic meters for a metric job, plus the conversions.

Rectangle, used for a slab, a pad, a gravel bed, and a mulch bed:

`cubicFeet = lengthFt × widthFt × thicknessFt`

`cubicYards = cubicFeet / 27`

Circle, reserved for a later round-pad page, is not in the first release:

`cubicFeet = π × (diameterFt / 2)² × thicknessFt`

Waste is applied after the net volume:

`orderCubicYards = netCubicYards × (1 + wastePercent / 100)`

The result shows net and order as two numbers. It does not replace the net with the padded figure.

### Concrete

`concrete.ts` takes the order volume and a bag yield.

`bags = ceil(orderCubicFeet / yieldCubicFeet)`

Bags round up. A partial bag is still a bag to buy. Yards stay at two decimal places for the net figure. The order in yards also stays exact to two decimals. This site does not round up to the next quarter yard, because that rule belongs to a plant and it changes. The page can say that a plant may sell in quarter-yard steps. It does not invent the step.

Worked check, which the tests must lock:

A 10 ft × 10 ft slab at 4 in is `10 × 10 × (4 / 12) = 33.333… cu ft`, which is `1.23 cu yd` net. At 10% waste the order is `1.36 cu yd`. At 0.60 cu ft per 80 lb bag, the bag count is `ceil(36.666… / 0.60) = 62` bags. If a published example on the page uses different waste, the test uses the page's waste, not a rounded story from another site.

### Gravel and mulch

`aggregate.ts` uses the same rectangle volume.

Tons, for gravel only:

`tons = orderCubicYards × tonsPerCubicYard`

The default density is the labeled starting value. Mulch does not show tons.

Mulch bags:

`bags = ceil(orderCubicFeet / bagCubicFeet)`

A 2 cu ft bag is the default. The field says so.

### Paint

`paint.ts` does not use cubic volume.

`area = wallLengthFt × wallHeightFt × wallCount − openingArea`

`gallons = area × coats / coveragePerGallon`

Quarts are `ceil(gallons × 4)` only as a second line when the gallon figure is under 1. Gallons show one decimal. The page says coverage is for smooth painted drywall and that a porous wall uses more.

Openings are optional. Empty means zero. A door the visitor types is subtracted once, not once per wall, and the label says that.

## Pages and URLs

Trailing slashes off. One H1 per page. The title tag leads with the query. Canonicals use `NEXT_PUBLIC_SITE_URL`.

| URL | H1 | Query the page is for |
|---|---|---|
| `/` | Concrete, gravel, mulch, and paint quantities | Home |
| `/concrete-calculator` | Concrete Calculator | concrete calculator |
| `/concrete-slab-calculator` | Concrete Slab Calculator | concrete slab calculator |
| `/concrete-pad-calculator` | Concrete Pad Calculator | concrete pad calculator |
| `/concrete-bag-calculator` | Concrete Bag Calculator | concrete bag calculator |
| `/gravel-calculator` | Gravel Calculator | gravel calculator |
| `/mulch-calculator` | Mulch Calculator | mulch calculator |
| `/paint-calculator` | Paint Calculator | paint calculator |
| `/about` | About | Who publishes the site |
| `/privacy` | Privacy | Advertising cookies |
| `/terms` | Terms | Estimates, not a contractor's bid |
| `/contact` | Contact | A real address |

The home page leads with gravel, the slab, and paint, because those are the queries a new site can rank for. The concrete head term is linked, and the page does not pretend this site is the only concrete calculator.

Each material page has its own 400–700 words: what the result means, the formula in plain language, what the default assumes, one worked example with the arithmetic written out, and four FAQs. The example's numbers are produced by the same function the tool uses, so the sentence cannot drift from the calculator.

Slab, pad, and bag pages keep the concrete formula and change the story:

- The slab page's example is a 10 × 10 ft patio at 4 in.
- The pad page's example is a 12 × 16 ft shed pad at 4 in.
- The bag page leads with the bag count and explains yield. Yards are still shown, because a plant order is in yards.

Do not add `/concrete-calculator-dallas` or a URL per thickness. A thickness is an input.

### Size pages

Common footprints get their own page under the calculator that owns them, for queries like "how much concrete for a 12x12 slab":

- `/concrete-slab-calculator/[size]`: 10x12, 12x12, 10x20, 20x20, 24x24, 30x40
- `/gravel-calculator/[size]`: 10x10, 12x20, 10x50, 20x50
- `/mulch-calculator/[size]`: 4x8, 3x20, 10x10, 6x30

The list lives in `content/sizes.ts`. Each page presets the calculator to its size, prints a table across depths (the thickness stays an input, so depths are rows, not URLs), and writes its example and FAQs from the same figure functions as the tool. `tests/sizes.test.ts` holds them to 400–700 words and checks every printed figure. Sizes the main pages already work (the 10x10 slab, the 12x16 pad) are not repeated. Any other size goes through the main calculator; add a size page only for a footprint people search for by name.

## Page template

Every calculator URL, top to bottom:

1. Breadcrumb. Home, then the tool.
2. H1 and a two-sentence introduction.
3. The tool. The result updates as the visitor types. There is no Calculate button.
4. Ad slot below the tool, empty until the client id is set, with a reserved height.
5. Formula, with each symbol defined.
6. One worked example.
7. FAQ.
8. Related tools. Concrete pages link gravel and paint. Gravel links concrete and mulch. Paint links the home page and concrete.
9. The default note: source, date checked, and the line that the bag or the can wins if it disagrees.

## Components

### SiteHeader

Sticky header. The wordmark links home. Links: Concrete, Gravel, Mulch, Paint. Concrete is the current item on all four concrete URLs. The theme control sits at the end of the row. Below the `md` breakpoint the links wrap onto a second row of chips so a phone does not hide a material. The header is a stacking context above the page grain, if a grain overlay is used, and it does not block clicks.

### SiteFooter

Site name, one sentence that the figures are planning quantities and not a contractor's order, and links to About, Privacy, Terms, and Contact. No price, no "order now."

### Breadcrumbs

An ordered list. The last crumb is the current page and is not a link. JSON-LD for the breadcrumb is emitted by `JsonLd`, not by this component.

### ThemeToggle

One button. It toggles the `dark` class on `<html>` and writes `theme` to `localStorage`. On the first visit, before any click, the page follows `prefers-color-scheme`. The button does not read theme state inside an effect. The inline script in the root layout applies the saved choice before paint.

### AdSlot

Two placements: `below` the tool, and `rail` on large screens only when a client id exists. With no client id the component renders nothing and takes no space. The slot is never beside an input. It is never inside the result.

### PageHero

Breadcrumbs, H1, and the introduction. The H1 is smaller than the result figure so the quantity is what the visitor sees first after the title.

### QuantityPage

The server wrapper for every calculator URL. It receives a page record and the tool node. It prints the JSON-LD, the hero, the tool, the ad slot, the formula, the example, the FAQ, the related links, and the default note. Prose stays in a column about 65 characters wide. The tool may be wider than the prose so the inputs and the result can sit side by side on a large screen.

### FormulaBlock

The formula as a single line in a monospace strip, then a definition list of the symbols. It does not recalculate. It explains the function the tool already called.

### WorkedExample

Two or three short paragraphs. The numbers are passed in from the page module, where they were computed with the calculator function at build time. The component only formats them.

### FaqList

A list of disclosures. The question is the summary. The answer is the body. The same questions and answers are passed to `JsonLd` as `FAQPage`. Four questions is the cap. Each answer includes a number from that page's example, so the FAQ is not identical on the slab page and the pad page.

### RelatedLinks

A short list of other tools. Each item is a title, one sentence, and a URL. The current page is not in the list.

### DefaultNote

One paragraph under the FAQ. It names the default the page started with, the source, and the date. It says the visitor's edited value replaces that default for the result on screen.

### JsonLd

One script tag. The graph holds `BreadcrumbList`, `FAQPage`, and `WebApplication`. `applicationCategory` is `UtilitiesApplication`. The offer price is 0 USD. The component does not invent a rating.

### NumberField

Label, text input, optional suffix, optional hint, error. `inputMode="decimal"`. The value is a string until `readNumber` accepts it. Empty and negative values are errors. Zero is allowed for an opening area and for waste. Zero is rejected for a length, a width, a thickness, a coverage rate, and a bag yield. The error is tied to the input with `aria-describedby`. The control is at least 48px tall and 16px text so a phone does not zoom.

### DimensionField

A length made of two `NumberField`s: a primary unit and a remainder. In US mode that is feet and inches. In metric mode it is meters and centimeters. It emits one decimal in the base unit. Inches wrap in the display only: the visitor can type 14 inches, and the field keeps 14 rather than silently rewriting the feet. The calculator converts. The label says which unit each box is.

### SelectField

A native select. Used for bag size on concrete (40, 60, 80 lb) and for mulch bag size (1.5, 2, 3 cu ft). Changing the option fills the yield field with that option's default and leaves the yield field editable. The select does not lock the yield.

### SegmentedControl

A group of buttons with `aria-pressed`. Used for US and metric. Changing it converts the current dimensions so the visitor does not lose the size they typed. Conversion uses `units.ts`. It does not reset waste or bag yield.

### ResultStat

One label and one value. The emphasis stat is the primary quantity: cubic yards for concrete and gravel, cubic yards for mulch, gallons for paint. The label is small capitals. The value is a large tabular figure. Secondary stats are the net volume, the order volume, the bag count, and the tonnage, in that order when they apply. A secondary stat that does not apply to the material is omitted, not shown as zero. Paint does not show yards. Gravel does not show gallons.

### ResultStage

The dark panel that holds the stats. It is the first region on a phone and the right column on a wide screen. It is sticky on large screens only, below the header. `aria-live="polite"` wraps the panel so a change is announced. An error from an input replaces the figure with one sentence. It does not show a zero that looks like a real quantity.

### VolumeTool

The client island for concrete, gravel, and mulch. Props name the material, the enabled outputs, and the starting defaults.

Behavior:

- Reads every field on each change.
- If any required field is invalid, the stage shows the first error and does not show a stale quantity.
- Calls `volume`, then `concrete` or `aggregate`.
- Shows net yards, order yards, and the material-specific line (bags or tons).
- Waste is a field, default 10, range 0 to 100. Above 100 is an error.
- Bag yield and gravel density are fields, prefilled from `defaults.ts`.

Concrete shows yards and bags together. The bag page uses the same component with the bag stat marked as the emphasis. Slab and pad use it with yards as the emphasis. That is a prop, not a second component.

### PaintTool

The client island for paint. It does not import the volume functions.

Fields: wall length, wall height, number of walls, coats, coverage per gallon, optional opening area. US and metric use `DimensionField` for length and height. Coverage stays in square feet per gallon in US mode and square meters per liter in metric mode, with the conversion in `units.ts`.

The emphasis stat is gallons. A second stat is the paintable area after openings. A third is quarts when gallons are under 1.

## Shared behavior

`readNumber` is the same idea as on Basefigure. It returns a result object, not a thrown error. The tool maps that error onto the field.

Results use `formatQuantity`:

- Yards and tons: two decimals, trailing zeros kept, so 1.20 does not become 1.2.
- Bags: a whole number, already rounded up by the formula.
- Gallons: one decimal.
- Square feet: a whole number.

The figure eases when the primary value changes. Reduced motion turns that animation off.

There is no Calculate button. There is no account. Refreshing the page restores the defaults. Nothing the visitor types is stored.

## SEO

`pageMetadata` sets the title, the description, the canonical URL, Open Graph, and Twitter card text. The sitemap lists the home page, the seven tools, and the four trust pages. `robots.txt` allows crawling and points at the sitemap.

`WebApplication` describes the tool. It does not describe a store. FAQ and breadcrumb graphs are on every calculator URL.

Titles:

| Page | Title |
|---|---|
| Home | Depthyard — Concrete, Gravel, Mulch, and Paint Quantities |
| Concrete | Concrete Calculator — Cubic Yards and Bags |
| Slab | Concrete Slab Calculator — Patio, Floor, and Shed Slab |
| Pad | Concrete Pad Calculator — Cubic Yards for a Pad |
| Bags | Concrete Bag Calculator — 40, 60, and 80 lb Bags |
| Gravel | Gravel Calculator — Cubic Yards and Tons |
| Mulch | Mulch Calculator — Cubic Yards and Bags |
| Paint | Paint Calculator — Gallons for a Room |

## Tests

`npm test` runs `tsx --test tests/*.test.ts`. The tests import the pure functions, not the React components.

They must lock:

- 10 × 10 ft at 4 in is 1.23 cu yd net.
- 10% waste on that slab is 1.36 cu yd order.
- 0.60 cu ft bags on that order is 62 bags, rounded up.
- 0% waste does not add a phantom yard.
- A zero thickness is rejected by the page parser. The geometry function is not called with it.
- Inches convert before dividing by 27. 4 inches is not treated as 4 feet.
- Gravel tons equal order yards times the density the caller passed.
- Mulch bags round up. A remainder of 0.1 bag is one more bag.
- Paint subtracts the opening once and multiplies by coats.
- A coverage of 0 is rejected.
- Metric and US paths of the same physical slab match within a rounding tolerance of 0.01 of the display unit.

## Build order

1. Pure functions and tests.
2. Format, SEO, site config, and the defaults file with sources still marked unchecked.
3. Layout, header, footer, and the quantity page template.
4. Volume tool, then the four concrete routes and gravel and mulch.
5. Paint tool and its route.
6. Home, trust pages, sitemap, robots.
7. Check the bag yields and the paint coverage against the printed sources. Fill `lastVerified`. Do not ship the defaults as guesses.
8. Read every page in a browser at a phone width and a desktop width. Change a dimension and confirm the result matches the test.

## What this site will not do

It will not show a dollar amount. It will not round an order up to a quarter yard and call that the supplier's rule. It will not publish one URL per city. It will not scrape another calculator for its yields. It will not share a navigation or a domain with Basefigure.
