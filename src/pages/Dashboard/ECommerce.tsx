import { FaBorderStyle } from 'react-icons/fa';
import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import ChartOne from '../../components/ChartOne.tsx';
import ChartThree from '../../components/ChartThree.tsx';
import ChartTwo from '../../components/ChartTwo.tsx';
import ChatCard from '../../components/ChatCard.tsx';
import MapOne from '../../components/MapOne.tsx';
import TableOne from '../../components/TableOne.tsx';
import { RootState } from '@/redux/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@/common/Loader/index.tsx';
import ErroPage from '@/components/common/ErroPage.tsx';
import { useEffect } from 'react';
import { getOrderStatus, getOrders } from '@/redux/features/order/orderSlice.ts';
import { CiDeliveryTruck } from 'react-icons/ci';
import { getCustomers } from '@/redux/features/customer/customerSlice.ts';
import { LiaUsersCogSolid } from 'react-icons/lia';
import { getProducts } from '@/redux/features/product/productSlice.ts';
import { RiProductHuntLine } from 'react-icons/ri';
import { MdPeopleOutline } from 'react-icons/md';

const ECommerce = () => {
  const { orders, orderStatus, isLoading, error } = useSelector((state: RootState) => state.order);
  const {customers} = useSelector((state: RootState) => state.customer);
  const {products} = useSelector((state: RootState) => state.product);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderStatus());
    dispatch(getOrders());
    dispatch(getCustomers());
    dispatch(getProducts())
  }, [dispatch]);

const orderStatusData = orderStatus.filter((s) => (
  s.status === "delivered"
));
  
if(error) return <ErroPage error={error}/>;

  return isLoading ? (<Loader/>):(
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne icons={<FaBorderStyle />} text="Total orders" count={orders.length}  />
        <CardTwo icons={<CiDeliveryTruck/>} text="Total delivery" count={orderStatusData?.length} />
        <CardThree icons={<MdPeopleOutline />} text="Total customers" count={customers.length} />
        <CardFour icons={<RiProductHuntLine />} text="Total product" count={products.length} />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne /> */}
        {/* <ChartTwo /> */}
        {/* <ChartThree /> */}
        {/* <MapOne /> */}
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
