import { Subscription } from "@/schema/user/subcription";

const SubscriptionIntroduce = (subcriptions: Subscription[]) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subscription Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subcriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">
              {subscription.sub_title}
            </h2>
            <p className="text-gray-600 mb-4">{subscription.sub_description}</p>
            <p className="text-lg font-bold mb-4">
              ${subscription.sub_price} / month
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionIntroduce;
