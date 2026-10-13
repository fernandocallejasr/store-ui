import type { Product } from "../products/types";
import ProductPrice from "../products/ProductPrice";
import Container from "../common/Container";
import { buttonClasses } from "../common/buttonStyles";
import { summarizeCatalog } from "./catalogSummary";

// Where each featured sticker sits in the pile, most popular first and on top.
const PILE = [
	"left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rotate-2",
	"left-0 top-0 z-20 -rotate-4",
	"bottom-0 right-0 z-10 rotate-5",
];

interface HomeHeroProps {
	products: Product[];
}

const HomeHero = ({ products }: HomeHeroProps) => {
	const { count, minPrice, featured } = summarizeCatalog(products);

	return (
		<section aria-labelledby="home-hero-title">
			<Container className="grid items-center gap-12 pb-16 pt-12 md:grid-cols-2 md:pt-20 lg:pt-24">
				<div>
					<h1
						id="home-hero-title"
						className="text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-100"
					>
						Small stickers. <span className="text-primary">Strong opinions.</span>
					</h1>
					<p className="mt-6 max-w-[48ch] text-lg text-pretty text-slate-600 dark:text-slate-400">
						Coding jokes, anime heroes, sports legends and moody cats.
						{minPrice !== null && (
							<>
								{" "}{count} {count === 1 ? "design" : "designs"}, from <ProductPrice price={minPrice} />.
							</>
						)}
					</p>
					<a href="#stickers" className={`mt-8 ${buttonClasses({ size: "lg" })}`}>
						Browse stickers
					</a>
				</div>

				{featured.length > 0 && (
					<div
						aria-hidden="true"
						className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md"
					>
						{featured.map((product, index) => (
							<img
								key={product.productId}
								src={product.imageUrl}
								alt=""
								fetchPriority={index === 0 ? "high" : "auto"}
								className={`absolute aspect-[10/11] w-3/5 rounded-xl object-cover shadow-xl shadow-slate-900/15 ring-1 ring-slate-900/5 dark:ring-white/10 ${PILE[index]}`}
							/>
						))}
					</div>
				)}
			</Container>
		</section>
	);
};

export default HomeHero;
