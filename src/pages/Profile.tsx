import { useLoaderData } from "react-router-dom";
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
		<div className="max-w-3xl w-full mx-auto px-6 py-8 font-primary">
			<h1 className="text-3xl font-semibold text-primary mb-6">Your Profile</h1>

			<dl className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md divide-y divide-gray-300 dark:divide-gray-700">
				{fields.map(({ label, value }) => (
					<div key={label} className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
						<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
							{label}
						</dt>
						<dd className="mt-1 sm:mt-0 sm:col-span-2 text-base text-gray-900 dark:text-gray-100 wrap-break-word">
							{value}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
};

export default Profile;
