
interface ProductPriceProps {
	currency: string;
	price: number;
};

const ProductPrice = ({ currency, price }: ProductPriceProps) => {
	return (
		<>
			{currency}
			<span>{price}</span>
		</>
	);
};

export default ProductPrice;