const priceFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

interface ProductPriceProps {
	price: number;
};

const ProductPrice = ({ price }: ProductPriceProps) => (
	<span className="font-mono tabular-nums">{priceFormatter.format(price)}</span>
);

export default ProductPrice;
