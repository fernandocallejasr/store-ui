import { useLoaderData } from "react-router-dom";
import PageHeading from "../components/PageHeading";
import Container from "../components/common/Container";
import type { profileLoader } from "./profileLoader";

const Profile = () => {
	const profile = useLoaderData<typeof profileLoader>();

	const fields = [
		{ label: "Name", value: profile.name },
		{ label: "Email", value: profile.email },
		{ label: "Mobile number", value: profile.mobileNumber },
		{ label: "User ID", value: String(profile.userId) },
	];

	return (
		<Container className="pb-16">
			<PageHeading title="Your profile" />

			<dl className="max-w-3xl divide-y divide-slate-200 rounded-xl bg-white dark:divide-slate-600 dark:bg-slate-700">
				{fields.map(({ label, value }) => (
					<div key={label} className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
						<dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
							{label}
						</dt>
						<dd className="mt-1 wrap-break-word text-slate-900 sm:col-span-2 sm:mt-0 dark:text-slate-200">
							{value}
						</dd>
					</div>
				))}
			</dl>
		</Container>
	);
};

export default Profile;
